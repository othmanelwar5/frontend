-- =============================================================================
-- Mizan Store — Admin Dashboard v2 Migration
-- File:    002_dashboard_v2.sql
-- Run on:  PostgreSQL (Neon / EasyPanel managed Postgres)
-- Purpose: Ensure all columns needed by the v2 admin dashboard exist,
--          create the order_status_history table, and add helpful indexes.
-- Safe:    Every statement uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.
--          Running this file more than once is harmless.
-- =============================================================================

-- ── 1. Ensure pgcrypto is available (for gen_random_uuid) ─────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 2. analytics_events table (created by migration 001 — idempotent) ─────────
CREATE TABLE IF NOT EXISTS analytics_events (
    id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name           VARCHAR(60)  NOT NULL,
    session_id           VARCHAR(120) NOT NULL,
    occurred_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    received_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
    path                 TEXT,
    url                  TEXT,
    referrer             TEXT,
    user_agent           TEXT,
    product_slug         VARCHAR(100),
    order_number         VARCHAR(30),
    properties           JSONB        NOT NULL DEFAULT '{}',

    ip_address           INET,
    country_code         CHAR(2),
    is_vpn               BOOLEAN      NOT NULL DEFAULT false,
    is_proxy             BOOLEAN      NOT NULL DEFAULT false,
    is_tor               BOOLEAN      NOT NULL DEFAULT false,
    is_hosting           BOOLEAN      NOT NULL DEFAULT false,
    is_bot               BOOLEAN      NOT NULL DEFAULT false,
    risk_score           DOUBLE PRECISION NOT NULL DEFAULT 0,
    vpn_provider         VARCHAR(80),
    vpn_provider_payload JSONB        NOT NULL DEFAULT '{}',
    maxmind_payload      JSONB        NOT NULL DEFAULT '{}',

    valid_for_metrics    BOOLEAN      NOT NULL DEFAULT false,
    rejected_reason      VARCHAR(200),
    bot_score            INTEGER      NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ae_occurred_at    ON analytics_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_ae_valid_name_day  ON analytics_events (valid_for_metrics, event_name, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_ae_session         ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_ae_product_slug    ON analytics_events (product_slug) WHERE product_slug IS NOT NULL;

-- ── 3. Extra columns on orders table ──────────────────────────────────────────
-- These may already exist if migration 001 ran. All are idempotent.

DO $$
BEGIN
    -- Tracking & attribution
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS source          TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS utm_source      TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS utm_medium      TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS utm_campaign    TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS utm_content     TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS utm_term        TEXT;

    -- Traffic validation (set by backend geo-check)
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS traffic_validated  BOOLEAN;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS ip_country         CHAR(2);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS vpn_detected       BOOLEAN;

    -- Admin operations
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_note         TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS confirmation_status TEXT;
END $$;

-- Indexes on orders
CREATE INDEX IF NOT EXISTS idx_orders_created_at       ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created   ON orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number     ON orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone            ON orders (phone);

-- ── 4. Order status history table ─────────────────────────────────────────────
-- Logged whenever an admin changes an order's status from the dashboard.
CREATE TABLE IF NOT EXISTS order_status_history (
    id           BIGSERIAL    PRIMARY KEY,
    order_id     UUID,                       -- FK to orders.id (uuid)
    order_number TEXT         NOT NULL,
    old_status   TEXT,
    new_status   TEXT         NOT NULL,
    note         TEXT,
    changed_by   TEXT,                       -- admin username from HTTP Basic Auth
    changed_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_osh_order_number
    ON order_status_history (order_number, changed_at DESC);

CREATE INDEX IF NOT EXISTS idx_osh_order_id
    ON order_status_history (order_id, changed_at DESC);

-- ── 5. Convenience views (replace-safe) ───────────────────────────────────────

CREATE OR REPLACE VIEW admin_traffic_daily AS
SELECT
    occurred_at::date                                                                        AS day,
    COUNT(*) FILTER (WHERE event_name = 'page_view'       AND valid_for_metrics)::int       AS page_views,
    COUNT(*) FILTER (WHERE event_name = 'product_view'    AND valid_for_metrics)::int       AS product_views,
    COUNT(*) FILTER (WHERE event_name = 'click'           AND valid_for_metrics)::int       AS valid_clicks,
    COUNT(*) FILTER (WHERE event_name = 'checkout_open'   AND valid_for_metrics)::int       AS checkout_opens,
    COUNT(DISTINCT session_id) FILTER (WHERE valid_for_metrics)::int                        AS valid_sessions,
    COUNT(*) FILTER (WHERE NOT valid_for_metrics AND country_code IS DISTINCT FROM 'SA')::int AS rejected_non_ksa,
    COUNT(*) FILTER (WHERE NOT valid_for_metrics AND (is_vpn OR is_proxy OR is_tor OR is_hosting))::int AS rejected_vpn,
    COUNT(*) FILTER (WHERE NOT valid_for_metrics AND is_bot)::int                           AS rejected_bots
FROM analytics_events
GROUP BY occurred_at::date;

CREATE OR REPLACE VIEW admin_product_traffic AS
SELECT
    product_slug,
    COUNT(*) FILTER (WHERE event_name = 'product_view' AND valid_for_metrics)::int          AS product_views,
    COUNT(*) FILTER (WHERE event_name = 'click'        AND valid_for_metrics)::int          AS valid_clicks,
    COUNT(*) FILTER (WHERE event_name = 'checkout_open'AND valid_for_metrics)::int          AS checkout_opens,
    COUNT(*) FILTER (WHERE event_name = 'order_created'AND valid_for_metrics)::int          AS tracked_orders
FROM analytics_events
WHERE product_slug IS NOT NULL
GROUP BY product_slug;

-- ── 6. Optional: backfill orders.ip_country = 'SA' for legacy rows ────────────
-- Uncomment if you want to retroactively mark old orders.
-- UPDATE orders SET ip_country = 'SA' WHERE ip_country IS NULL;

-- ── Done ───────────────────────────────────────────────────────────────────────
-- No data changes. All structural additions above are safe to re-run.
