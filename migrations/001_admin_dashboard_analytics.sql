-- Mizan admin dashboard analytics migration
-- Target database: PostgreSQL
-- Purpose: store only backend-validated analytics events for dashboard metrics.
-- The backend must set valid_for_metrics=true only after:
-- 1) client IP resolves to country_code='SA' with MaxMind GeoIP
-- 2) MaxMind Anonymous IP and the secondary VPN provider do not flag VPN/proxy/Tor/hosting
-- 3) request is not an obvious bot/internal/test request

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(60) NOT NULL,
    session_id VARCHAR(120) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    path TEXT,
    url TEXT,
    referrer TEXT,
    user_agent TEXT,
    product_slug VARCHAR(100),
    order_number VARCHAR(30),
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,

    ip_address INET,
    country_code CHAR(2),
    is_vpn BOOLEAN NOT NULL DEFAULT false,
    is_proxy BOOLEAN NOT NULL DEFAULT false,
    is_tor BOOLEAN NOT NULL DEFAULT false,
    is_hosting BOOLEAN NOT NULL DEFAULT false,
    is_bot BOOLEAN NOT NULL DEFAULT false,
    risk_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    vpn_provider VARCHAR(80),
    vpn_provider_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    maxmind_payload JSONB NOT NULL DEFAULT '{}'::jsonb,

    valid_for_metrics BOOLEAN NOT NULL DEFAULT false,
    rejected_reason VARCHAR(200),
    bot_score INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred_at
    ON analytics_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_valid_name_date
    ON analytics_events (valid_for_metrics, event_name, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session
    ON analytics_events (session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_product
    ON analytics_events (product_slug)
    WHERE product_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_analytics_events_properties_gin
    ON analytics_events USING GIN (properties);

CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT,
    order_number TEXT,
    old_status TEXT,
    new_status TEXT NOT NULL,
    note TEXT,
    changed_by TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_number
    ON order_status_history (order_number, changed_at DESC);

DO $$
BEGIN
    IF to_regclass('public.orders') IS NOT NULL THEN
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_note TEXT;
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS source TEXT;
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_source TEXT;
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_medium TEXT;
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS traffic_validated BOOLEAN;
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS ip_country CHAR(2);
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS vpn_detected BOOLEAN;
        ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS confirmation_status TEXT;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'created_at') THEN
            CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'status')
           AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'created_at') THEN
            CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON public.orders (status, created_at DESC);
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'order_number') THEN
            CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders (order_number);
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'phone') THEN
            CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders (phone);
        END IF;
    END IF;
END $$;

CREATE OR REPLACE VIEW admin_traffic_daily AS
SELECT
    occurred_at::date AS day,
    COUNT(*) FILTER (WHERE event_name = 'page_view' AND valid_for_metrics) AS page_views,
    COUNT(*) FILTER (WHERE event_name = 'product_view' AND valid_for_metrics) AS product_views,
    COUNT(*) FILTER (WHERE event_name = 'click' AND valid_for_metrics) AS valid_clicks,
    COUNT(*) FILTER (WHERE event_name = 'checkout_open' AND valid_for_metrics) AS checkout_opens,
    COUNT(*) FILTER (WHERE event_name = 'order_submit_attempt' AND valid_for_metrics) AS order_submit_attempts,
    COUNT(*) FILTER (WHERE event_name = 'order_created' AND valid_for_metrics) AS tracked_orders,
    COUNT(*) FILTER (WHERE NOT valid_for_metrics AND country_code IS DISTINCT FROM 'SA') AS rejected_non_ksa,
    COUNT(*) FILTER (WHERE NOT valid_for_metrics AND (is_vpn OR is_proxy OR is_tor OR is_hosting)) AS rejected_vpn_proxy,
    COUNT(*) FILTER (WHERE NOT valid_for_metrics AND is_bot) AS rejected_bots
FROM analytics_events
GROUP BY occurred_at::date;

CREATE OR REPLACE VIEW admin_product_traffic AS
SELECT
    product_slug,
    COUNT(*) FILTER (WHERE event_name = 'product_view' AND valid_for_metrics) AS product_views,
    COUNT(*) FILTER (WHERE event_name = 'click' AND valid_for_metrics) AS valid_clicks,
    COUNT(*) FILTER (WHERE event_name = 'add_to_cart' AND valid_for_metrics) AS add_to_cart,
    COUNT(*) FILTER (WHERE event_name = 'checkout_open' AND valid_for_metrics) AS checkout_opens,
    COUNT(*) FILTER (WHERE event_name = 'order_created' AND valid_for_metrics) AS tracked_orders
FROM analytics_events
WHERE product_slug IS NOT NULL
GROUP BY product_slug;
