# Project Architecture

## Overview

`mymizan` is a two-app ecommerce system:

- Frontend: Next.js Arabic RTL storefront.
- Backend: FastAPI order API and integration layer.
- Database: PostgreSQL on EasyPanel.
- External order ops: Google Sheets through Apps Script webhook.
- Tracking: browser pixels plus backend CAPI for Meta, TikTok, Snap.

## Data Flow

1. Visitor lands from TikTok/Snapchat/Meta ad.
2. Frontend captures UTMs, click ids, and pixel cookies.
3. Visitor selects a product offer.
4. Cart drawer opens and shows cross-sells.
5. Checkout modal collects name and phone.
6. Frontend validates Saudi phone and opens upsell modal.
7. Visitor accepts or declines upsell.
8. Frontend sends final order to FastAPI.
9. Backend validates phone and recalculates prices.
10. Backend stores order in PostgreSQL.
11. Backend sends order to Google Sheets webhook.
12. Backend sends CAPI events with dedup ids.
13. Frontend redirects to thank-you page.

## Frontend Responsibilities

- Arabic pages and conversion UX.
- Cart state.
- Offer selection.
- Checkout form validation.
- Upsell modal.
- Browser pixel firing.
- Attribution capture.

Frontend must not:

- Store server tokens.
- Be source of truth for prices.
- Hash PII for CAPI as a replacement for backend hashing.

## Backend Responsibilities

- Validate all order data.
- Recalculate totals from trusted config.
- Persist orders.
- Run migrations.
- Forward orders to Google Sheets.
- Send CAPI.
- Log integration attempts.

Backend must not:

- Trust frontend totals.
- Fail checkout because one ad platform CAPI is down.
- Leak secrets in responses.

## Integration Boundaries

Frontend to backend:

- JSON over HTTPS.
- `POST /orders` is the main endpoint.

Backend to Google Sheets:

- HTTP POST to Apps Script URL.
- Shared secret.

Backend to ad platforms:

- Access tokens from env.
- SHA-256 hashed user identifiers.
- Event ids matching browser events.

## Reliability

Required behavior:

- If Sheets fails, keep order in DB and mark `sheet_failed`.
- If CAPI fails, keep order successful and log failure.
- If DB fails, order cannot be accepted.

## Local Development

Expected:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Postgres can run in Docker locally or use EasyPanel internal DB only in production.

Provide a `docker-compose.yml` if helpful for local development, but EasyPanel deployment can use separate services.
