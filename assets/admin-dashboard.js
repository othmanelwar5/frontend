/* =============================================================================
   Mizan Admin Dashboard — v2
   KSA COD DTC store · MaxMind + VPN-validated metrics only
   ============================================================================= */
(function () {
    "use strict";

    /* ── Config ────────────────────────────────────────────────────────────── */

    const API_BASE = (
        typeof window.MYMIZAN_API_URL === "string" && window.MYMIZAN_API_URL.trim()
            ? window.MYMIZAN_API_URL.trim()
            : "https://api.mymizan.shop"
    ).replace(/\/+$/, "");

    const PRODUCT_NAMES = {
        "d3-k2-gummies":           "D3 + K2 Gummies",
        "sleep-tea":               "Sleep Tea",
        "probiotic-fiber-gummies": "Probiotic + Fiber Gummies",
    };

    const STATUS_META = {
        pending:   { label: "Pending",   color: "amber",   hex: "#B45309" },
        confirmed: { label: "Confirmed", color: "blue",    hex: "#0B4F6C" },
        shipped:   { label: "Shipped",   color: "purple",  hex: "#7C3AED" },
        delivered: { label: "Delivered", color: "green",   hex: "#15803D" },
        cancelled: { label: "Cancelled", color: "red",     hex: "#B91C1C" },
        returned:  { label: "Returned",  color: "gray",    hex: "#5C7280" },
    };

    /* ── State ─────────────────────────────────────────────────────────────── */

    const state = {
        credentials:   getStoredCredentials(),
        dashboard:     null,
        orders:        [],
        selectedOrder: null,
        activeTab:     "overview",
        charts:        {},
    };

    /* ── DOM cache ─────────────────────────────────────────────────────────── */

    const $ = id => document.getElementById(id);
    const els = {};

    /* ── Boot ──────────────────────────────────────────────────────────────── */

    document.addEventListener("DOMContentLoaded", () => {
        cacheElements();
        setDefaultDates();
        bindEvents();
        updateAuthUi();
        if (state.credentials) loadDashboard();
    });

    function cacheElements() {
        [
            "date-from", "date-to", "refresh-dashboard", "refresh-label", "refresh-icon",
            "logout-admin", "admin-alert",
            "login-modal", "login-form", "admin-username", "admin-password", "login-error",
            "metric-clicks", "metric-clicks-note", "metric-orders", "metric-orders-note",
            "metric-conversion", "metric-revenue", "metric-aov",
            "metric-page-views", "metric-sessions", "metric-checkouts", "metric-checkout-cvr",
            "daily-chart", "funnel-list", "status-breakdown",
            "top-products", "recent-orders",
            "orders-status", "orders-search", "orders-table", "orders-count", "export-csv",
            "product-breakdown", "traffic-quality", "rejection-chart",
            "order-drawer", "order-preview",
            "sidebar", "sidebar-overlay", "sidebar-toggle",
            "page-title",
        ].forEach(id => { els[id] = $(id); });
    }

    /* ── Events ────────────────────────────────────────────────────────────── */

    function bindEvents() {
        // Login form
        els["login-form"].addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = els["admin-username"].value.trim();
            const password = els["admin-password"].value;
            if (!username || !password) return;

            hideEl(els["login-error"]);
            const prev = state.credentials;
            state.credentials = { username, password };

            try {
                await apiFetch("/admin/session");
                sessionStorage.setItem("mymizan_admin_auth", JSON.stringify(state.credentials));
                updateAuthUi();
                loadDashboard();
            } catch (err) {
                state.credentials = prev;
                sessionStorage.removeItem("mymizan_admin_auth");
                els["login-error"].textContent = err.status === 503
                    ? "Admin credentials are not configured on the backend."
                    : "Invalid username or password.";
                showEl(els["login-error"]);
            }
        });

        // Logout
        els["logout-admin"].addEventListener("click", () => {
            sessionStorage.removeItem("mymizan_admin_auth");
            state.credentials = null;
            updateAuthUi();
        });

        // Date controls
        els["refresh-dashboard"].addEventListener("click", loadDashboard);
        els["date-from"].addEventListener("change", loadDashboard);
        els["date-to"].addEventListener("change", loadDashboard);

        // Date presets
        document.querySelectorAll(".date-preset").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".date-preset").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                applyPreset(btn.dataset.preset);
                loadDashboard();
            });
        });

        // Tab nav
        document.querySelectorAll("[data-tab-target]").forEach(btn => {
            btn.addEventListener("click", () => switchTab(btn.dataset.tabTarget));
        });

        // Orders filters
        els["orders-status"].addEventListener("change", loadOrders);
        els["orders-search"].addEventListener("input", debounce(loadOrders, 300));

        // Export CSV
        els["export-csv"].addEventListener("click", exportCsv);

        // Order table + recent orders click → drawer
        els["orders-table"].addEventListener("click", handleOrderClick);
        els["recent-orders"].addEventListener("click", handleOrderClick);

        // Close order drawer
        els["order-drawer"].addEventListener("click", (e) => {
            if (e.target.closest("[data-close-order]")) closeOrderPreview();
        });

        // Sidebar mobile toggle
        els["sidebar-toggle"].addEventListener("click", openSidebar);
        els["sidebar-overlay"].addEventListener("click", closeSidebar);

        // Keyboard
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                if (!els["order-drawer"].classList.contains("hidden")) closeOrderPreview();
                else closeSidebar();
            }
        });
    }

    function handleOrderClick(e) {
        const btn = e.target.closest("[data-preview-order]");
        if (btn) openOrderPreview(btn.dataset.previewOrder);
    }

    /* ── Sidebar mobile ─────────────────────────────────────────────────────── */

    function openSidebar() {
        els["sidebar"].classList.remove("-translate-x-full");
        showEl(els["sidebar-overlay"]);
    }
    function closeSidebar() {
        els["sidebar"].classList.add("-translate-x-full");
        hideEl(els["sidebar-overlay"]);
    }

    /* ── Date helpers ───────────────────────────────────────────────────────── */

    function setDefaultDates() {
        applyPreset("7d");
    }

    function applyPreset(preset) {
        const today = new Date();
        let from = new Date();

        switch (preset) {
            case "today":
                from = new Date(today);
                break;
            case "yesterday":
                from = new Date(today);
                from.setDate(today.getDate() - 1);
                today.setDate(today.getDate() - 1);
                break;
            case "7d":
                from.setDate(today.getDate() - 6);
                break;
            case "30d":
                from.setDate(today.getDate() - 29);
                break;
            case "month":
                from = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
        }

        els["date-from"].value = fmtDateInput(from);
        els["date-to"].value   = fmtDateInput(today);
    }

    function fmtDateInput(d) { return d.toISOString().slice(0, 10); }

    function dateParams() {
        return { from: els["date-from"].value, to: els["date-to"].value };
    }
    function dateQuery() { return new URLSearchParams(dateParams()).toString(); }

    /* ── Data loading ───────────────────────────────────────────────────────── */

    async function loadDashboard() {
        if (!state.credentials) return;
        setLoading(true);
        hideAlert();
        try {
            const data = await apiFetch(`/admin/dashboard?${dateQuery()}`)
                .catch(() => apiFetch(`/admin/metrics?${dateQuery()}`));
            state.dashboard = normalizeDashboard(data);
            renderDashboard();
            await loadOrders();
        } catch (err) {
            showAlert("error", err.message || "Could not load dashboard.");
            if (err.status === 401 || err.status === 403) handleAuthError(err);
        } finally {
            setLoading(false);
        }
    }

    async function loadOrders() {
        if (!state.credentials) return;
        try {
            const params = new URLSearchParams(dateParams());
            const s = els["orders-status"].value;
            const q = els["orders-search"].value.trim();
            if (s) params.set("status", s);
            if (q) params.set("search", q);
            params.set("limit", "200");

            const res = await apiFetch(`/admin/orders?${params.toString()}`);
            state.orders = normalizeOrders(res.orders || res.data || res);
            renderOrders();
            renderRecentOrders();
        } catch (err) {
            showAlert("error", err.message || "Could not load orders.");
            state.orders = [];
            renderOrders();
            renderRecentOrders();
        }
    }

    async function openOrderPreview(orderId) {
        const cached = state.orders.find(o => String(o.id) === String(orderId) || String(o.order_number) === String(orderId));
        state.selectedOrder = cached || null;
        renderOrderPreview(state.selectedOrder, true);
        showEl(els["order-drawer"]);
        els["order-drawer"].classList.remove("hidden");

        try {
            const fresh = await apiFetch(`/admin/orders/${encodeURIComponent(orderId)}`);
            state.selectedOrder = normalizeOrder(fresh.order || fresh.data || fresh);
            renderOrderPreview(state.selectedOrder, false);
        } catch (err) {
            if (!cached) renderOrderPreview(null, false, err.message || "Order not found.");
        }
    }

    function closeOrderPreview() {
        els["order-drawer"].classList.add("hidden");
        state.selectedOrder = null;
    }

    /* ── Export CSV ─────────────────────────────────────────────────────────── */

    async function exportCsv() {
        if (!state.credentials) return;
        const params = new URLSearchParams(dateParams());
        const s = els["orders-status"].value;
        if (s) params.set("status", s);

        const url = `${API_BASE}/admin/orders/export.csv?${params.toString()}`;
        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Basic ${btoa(`${state.credentials.username}:${state.credentials.password}`)}`,
                },
            });
            if (!res.ok) throw new Error("Export failed");
            const blob = await res.blob();
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `orders_${els["date-from"].value}_${els["date-to"].value}.csv`;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (err) {
            showAlert("error", "Could not export CSV.");
        }
    }

    /* ── Status update ──────────────────────────────────────────────────────── */

    async function updateOrderStatus(orderId, newStatus, noteValue) {
        try {
            const res = await apiFetch(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus, note: noteValue || null }),
            });
            // Patch in state
            if (state.selectedOrder && String(state.selectedOrder.id) === String(orderId)) {
                state.selectedOrder.status = res.status;
                renderOrderPreview(state.selectedOrder, false);
            }
            const idx = state.orders.findIndex(o => String(o.id) === String(orderId));
            if (idx !== -1) {
                state.orders[idx].status = res.status;
                renderOrders();
            }
            return true;
        } catch (err) {
            showAlert("error", "Could not update status: " + (err.message || "unknown error"));
            return false;
        }
    }

    async function updateOrderNote(orderId, note) {
        try {
            await apiFetch(`/admin/orders/${encodeURIComponent(orderId)}/note`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ note }),
            });
            if (state.selectedOrder && String(state.selectedOrder.id) === String(orderId)) {
                state.selectedOrder.admin_note = note;
            }
            return true;
        } catch {
            return false;
        }
    }

    /* ── API ────────────────────────────────────────────────────────────────── */

    async function apiFetch(path, options = {}) {
        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                Accept: "application/json",
                Authorization: `Basic ${btoa(`${state.credentials.username}:${state.credentials.password}`)}`,
                ...(options.headers || {}),
            },
            credentials: "omit",
        });
        if (!res.ok) {
            const err = new Error(await res.text() || `HTTP ${res.status}`);
            err.status = res.status;
            throw err;
        }
        return res.json();
    }

    /* ── Normalizers ────────────────────────────────────────────────────────── */

    function normalizeDashboard(payload) {
        const m  = payload.metrics || payload.summary || payload;
        const clicks   = num(m.valid_clicks ?? m.clicks ?? 0);
        const orders   = num(m.orders ?? m.order_count ?? 0);
        const revenue  = num(m.revenue ?? m.total_revenue ?? 0);
        const checkouts = num(m.checkout_opens ?? m.checkout_started ?? 0);

        return {
            metrics: {
                clicks,
                page_views:       num(m.page_views ?? 0),
                product_views:    num(m.product_views ?? 0),
                checkout_opens:   checkouts,
                orders,
                revenue,
                aov:              num(m.aov ?? (orders ? revenue / orders : 0)),
                conversion_rate:  m.conversion_rate != null ? num(m.conversion_rate) : safeRate(orders, clicks),
                checkout_cvr:     safeRate(orders, checkouts),
                rejected_non_ksa: num(m.rejected_non_ksa ?? 0),
                rejected_vpn:     num(m.rejected_vpn ?? 0),
                rejected_bot:     num(m.rejected_bot ?? 0),
                valid_sessions:   num(m.valid_sessions ?? 0),
            },
            series:           normalizeSeries(payload.series || payload.daily || []),
            products:         normalizeProducts(payload.products || payload.product_breakdown || []),
            funnel:           normalizeFunnel(payload.funnel || m),
            status_breakdown: payload.status_breakdown || {},
        };
    }

    function normalizeOrders(input) {
        if (!Array.isArray(input)) return [];
        return input.map(normalizeOrder);
    }

    function normalizeOrder(o) {
        const items = Array.isArray(o.items) ? o.items : [];
        return {
            id:               o.id ?? o.order_id ?? o.order_number,
            order_number:     o.order_number ?? o.order_id ?? o.id ?? "—",
            created_at:       o.created_at ?? o.date ?? o.createdAt ?? null,
            customer_name:    o.customer_name ?? o.name ?? o.customer?.name ?? "—",
            phone:            o.phone ?? o.customer_phone ?? o.customer?.phone ?? "—",
            city:             o.city ?? o.customer?.city ?? "—",
            status:           (o.status || "pending").toLowerCase(),
            total:            num(o.total ?? o.total_sar ?? 0),
            subtotal:         num(o.subtotal ?? o.total ?? 0),
            currency:         o.currency || "SAR",
            source:           o.source || "storefront",
            utm_campaign:     o.utm_campaign || o.campaign || "",
            utm_source:       o.utm_source || "",
            utm_medium:       o.utm_medium || "",
            admin_note:       o.admin_note || "",
            ip_country:       o.ip_country || o.country || "SA",
            traffic_validated:o.traffic_validated ?? null,
            vpn_detected:     o.vpn_detected ?? null,
            items: items.map(i => ({
                product_slug: i.product_slug || i.slug || i.sku || "",
                name:         i.name || PRODUCT_NAMES[i.product_slug || i.slug] || "Product",
                quantity:     num(i.quantity ?? i.qty ?? 1),
                price:        num(i.price ?? i.unit_price ?? i.total ?? 0),
                total:        num(i.total ?? i.price ?? 0),
                sku:          i.sku || "",
            })),
        };
    }

    function normalizeSeries(input) {
        if (!Array.isArray(input)) return [];
        return input.map(r => ({
            date:          r.date || r.day || "",
            page_views:    num(r.page_views ?? 0),
            clicks:        num(r.valid_clicks ?? r.clicks ?? 0),
            checkout_opens:num(r.checkout_opens ?? 0),
            orders:        num(r.orders ?? r.order_count ?? 0),
            revenue:       num(r.revenue ?? r.gmv ?? 0),
        }));
    }

    function normalizeProducts(input) {
        if (!Array.isArray(input)) return [];
        return input.map(r => {
            const slug   = r.product_slug || r.slug || r.sku || "";
            const clicks = num(r.valid_clicks ?? r.clicks ?? 0);
            const orders = num(r.orders ?? r.order_count ?? 0);
            return {
                slug,
                name:            r.name || PRODUCT_NAMES[slug] || slug || "Product",
                sku:             r.sku || "",
                clicks,
                product_views:   num(r.product_views ?? 0),
                orders,
                revenue:         num(r.revenue ?? r.gmv ?? 0),
                conversion_rate: r.conversion_rate != null ? num(r.conversion_rate) : safeRate(orders, clicks),
            };
        });
    }

    function normalizeFunnel(f) {
        return [
            { label: "Page views",    value: num(f.page_views  ?? 0) },
            { label: "Product views", value: num(f.product_views ?? 0) },
            { label: "Valid clicks",  value: num(f.valid_clicks ?? f.clicks ?? 0) },
            { label: "Checkout opens",value: num(f.checkout_opens ?? 0) },
            { label: "Orders",        value: num(f.orders ?? 0) },
        ].filter(s => s.value > 0 || s.label === "Orders");
    }

    /* ── Rendering ──────────────────────────────────────────────────────────── */

    function renderDashboard() {
        const d = state.dashboard;
        const m = d.metrics;

        // Primary KPIs
        setText(els["metric-clicks"],     fmtNumber(m.clicks));
        setText(els["metric-orders"],     fmtNumber(m.orders));
        setText(els["metric-conversion"], fmtPct(m.conversion_rate));
        setText(els["metric-revenue"],    fmtMoney(m.revenue));
        setText(els["metric-aov"],        `AOV ${fmtMoney(m.aov)}`);
        setText(els["metric-clicks-note"],`${fmtNumber(m.page_views)} page views`);
        setText(els["metric-orders-note"],`${fmtNumber(m.checkout_opens)} checkout opens`);

        // Secondary KPIs
        setText(els["metric-page-views"],    fmtNumber(m.page_views));
        setText(els["metric-sessions"],      fmtNumber(m.valid_sessions));
        setText(els["metric-checkouts"],     fmtNumber(m.checkout_opens));
        setText(els["metric-checkout-cvr"],  fmtPct(m.checkout_cvr));

        renderDailyChart(d.series);
        renderFunnel(d.funnel);
        renderStatusBreakdown(d.status_breakdown, m.orders);
        renderProducts(d.products);
        renderTrafficQuality(m);
        renderRejectionChart(m);
        renderRecentOrders();
    }

    /* Chart.js daily chart */
    function renderDailyChart(series) {
        const ctx = els["daily-chart"];
        if (!ctx) return;

        if (state.charts.daily) {
            state.charts.daily.destroy();
            state.charts.daily = null;
        }

        if (!series.length) {
            ctx.parentElement.innerHTML = emptyState("No daily data yet.");
            return;
        }

        const labels  = series.map(r => r.date);
        const clicks  = series.map(r => r.clicks);
        const orders  = series.map(r => r.orders);
        const revenue = series.map(r => r.revenue);

        state.charts.daily = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Valid Clicks",
                        data: clicks,
                        borderColor: "#14919B",
                        backgroundColor: "rgba(20,145,155,0.08)",
                        tension: 0.35,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        yAxisID: "y",
                    },
                    {
                        label: "Orders",
                        data: orders,
                        borderColor: "#0B4F6C",
                        backgroundColor: "rgba(11,79,108,0.08)",
                        tension: 0.35,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        yAxisID: "y",
                    },
                    {
                        label: "Revenue (SAR)",
                        data: revenue,
                        borderColor: "#15803D",
                        backgroundColor: "transparent",
                        tension: 0.35,
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        yAxisID: "y2",
                        borderDash: [4, 4],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: "#1A2B33",
                        titleColor: "#E5F3F7",
                        bodyColor: "#E5F3F7",
                        padding: 10,
                        callbacks: {
                            label(ctx) {
                                if (ctx.datasetIndex === 2)
                                    return ` Revenue: ${fmtMoney(ctx.parsed.y)}`;
                                return ` ${ctx.dataset.label}: ${fmtNumber(ctx.parsed.y)}`;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { color: "rgba(11,79,108,0.06)" },
                        ticks: { color: "#5C7280", font: { size: 11, weight: "700" } },
                    },
                    y: {
                        position: "left",
                        grid: { color: "rgba(11,79,108,0.06)" },
                        ticks: { color: "#5C7280", font: { size: 11 }, precision: 0 },
                    },
                    y2: {
                        position: "right",
                        grid: { drawOnChartArea: false },
                        ticks: {
                            color: "#15803D",
                            font: { size: 11 },
                            callback: v => `${Math.round(v / 1000)}k`,
                        },
                    },
                },
            },
        });
    }

    /* Funnel */
    function renderFunnel(funnel) {
        if (!funnel.length) {
            els["funnel-list"].innerHTML = emptyState("No funnel data yet.");
            return;
        }
        const max = Math.max(...funnel.map(s => s.value), 1);
        els["funnel-list"].innerHTML = funnel.map((step, i) => {
            const w    = Math.max(6, (step.value / max) * 100);
            const prev = i > 0 ? funnel[i - 1].value : step.value;
            const drop = i === 0 ? "100%" : fmtPct(safeRate(step.value, prev));
            return `
                <div>
                    <div class="flex items-center justify-between text-sm font-bold mb-1.5">
                        <span class="text-charcoal">${esc(step.label)}</span>
                        <span class="text-primary">${fmtNumber(step.value)}</span>
                    </div>
                    <div class="h-2.5 overflow-hidden rounded-full bg-secondary">
                        <div class="h-full rounded-full bg-accent transition-all duration-700" style="width:${w}%"></div>
                    </div>
                    <p class="mt-1 text-[10px] font-semibold text-muted">${drop} from previous</p>
                </div>`;
        }).join("");
    }

    /* Status breakdown */
    function renderStatusBreakdown(breakdown, totalOrders) {
        const entries = Object.entries(breakdown || {});
        if (!entries.length || totalOrders === 0) {
            els["status-breakdown"].innerHTML = emptyState("No orders in range.");
            return;
        }
        const sorted = entries.sort((a, b) => b[1] - a[1]);
        els["status-breakdown"].innerHTML = sorted.map(([st, cnt]) => {
            const meta = STATUS_META[st] || { label: st, hex: "#5C7280" };
            const pct  = Math.round((cnt / totalOrders) * 100);
            return `
                <div class="flex items-center gap-3">
                    <span class="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0" style="background:${meta.hex}"></span>
                    <span class="flex-1 text-sm font-bold text-charcoal">${meta.label}</span>
                    <span class="text-sm font-extrabold text-primary">${cnt}</span>
                    <span class="text-xs font-bold text-muted w-10 text-right">${pct}%</span>
                </div>`;
        }).join("");
    }

    /* Products overview strip */
    function renderProducts(products) {
        const sorted = [...products].sort((a, b) => b.revenue - a.revenue);

        if (!sorted.length) {
            els["top-products"].innerHTML    = emptyState("No product data yet.");
            els["product-breakdown"].innerHTML = emptyState("No product data yet.");
            return;
        }

        // Sidebar top-5 widget
        els["top-products"].innerHTML = sorted.slice(0, 5).map((p, i) => `
            <div class="flex items-center gap-3 rounded-2xl border border-primary/8 bg-cream p-3">
                <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-extrabold text-primary">${i + 1}</span>
                <div class="min-w-0 flex-1">
                    <strong class="block truncate text-sm text-charcoal">${esc(p.name)}</strong>
                    <span class="text-[10px] font-bold text-muted">${fmtNumber(p.orders)} orders · ${fmtPct(p.conversion_rate)} CVR</span>
                </div>
                <span class="flex-shrink-0 text-sm font-extrabold text-success">${fmtMoney(p.revenue)}</span>
            </div>`).join("");

        // Products tab detailed cards
        els["product-breakdown"].innerHTML = sorted.map(p => `
            <article class="rounded-3xl border border-primary/10 bg-white p-5 hover:shadow-md transition-shadow">
                <p class="text-[10px] font-extrabold uppercase tracking-[0.18em] text-accent">${esc(p.sku || p.slug || "SKU")}</p>
                <h3 class="mt-2 text-base font-extrabold text-primary leading-tight">${esc(p.name)}</h3>
                <dl class="mt-4 grid grid-cols-2 gap-2.5 text-sm">
                    <div class="rounded-2xl bg-secondary/50 p-3">
                        <dt class="text-[10px] font-extrabold uppercase tracking-wider text-muted">Clicks</dt>
                        <dd class="mt-1 text-xl font-extrabold text-charcoal">${fmtNumber(p.clicks)}</dd>
                    </div>
                    <div class="rounded-2xl bg-secondary/50 p-3">
                        <dt class="text-[10px] font-extrabold uppercase tracking-wider text-muted">Product views</dt>
                        <dd class="mt-1 text-xl font-extrabold text-charcoal">${fmtNumber(p.product_views)}</dd>
                    </div>
                    <div class="rounded-2xl bg-secondary/50 p-3">
                        <dt class="text-[10px] font-extrabold uppercase tracking-wider text-muted">Orders</dt>
                        <dd class="mt-1 text-xl font-extrabold text-charcoal">${fmtNumber(p.orders)}</dd>
                    </div>
                    <div class="rounded-2xl bg-secondary/50 p-3">
                        <dt class="text-[10px] font-extrabold uppercase tracking-wider text-muted">CVR</dt>
                        <dd class="mt-1 text-xl font-extrabold text-charcoal">${fmtPct(p.conversion_rate)}</dd>
                    </div>
                    <div class="rounded-2xl bg-primary/6 p-3 col-span-2">
                        <dt class="text-[10px] font-extrabold uppercase tracking-wider text-muted">Revenue</dt>
                        <dd class="mt-1 text-2xl font-extrabold text-primary">${fmtMoney(p.revenue)}</dd>
                    </div>
                </dl>
            </article>`).join("");
    }

    /* Traffic quality cards */
    function renderTrafficQuality(m) {
        const cards = [
            { label: "Valid sessions",    value: m.valid_sessions,   note: "Passed KSA + VPN checks",       color: "success" },
            { label: "Rejected non-KSA",  value: m.rejected_non_ksa, note: "Country ≠ Saudi Arabia",        color: "warning" },
            { label: "Rejected VPN/proxy",value: m.rejected_vpn,     note: "MaxMind anonymous IP flags",    color: "danger" },
            { label: "Rejected bots",     value: m.rejected_bot,     note: "Bot / automation user-agent",   color: "muted"   },
        ];
        const colorMap = {
            success: "border-success/20 bg-success/8 text-success",
            warning: "border-warning/20 bg-warning/8 text-warning",
            danger:  "border-danger/20 bg-danger/8 text-danger",
            muted:   "border-primary/10 bg-secondary/50 text-muted",
        };
        els["traffic-quality"].innerHTML = cards.map(c => `
            <article class="rounded-3xl border ${colorMap[c.color]} p-5">
                <span class="text-[10px] font-extrabold uppercase tracking-[0.18em] opacity-80">${esc(c.label)}</span>
                <strong class="mt-3 block text-3xl font-extrabold">${fmtNumber(c.value)}</strong>
                <p class="mt-2 text-xs font-semibold leading-5 opacity-70">${esc(c.note)}</p>
            </article>`).join("");
    }

    /* Rejection doughnut chart */
    function renderRejectionChart(m) {
        const ctx = els["rejection-chart"];
        if (!ctx) return;

        if (state.charts.rejection) {
            state.charts.rejection.destroy();
            state.charts.rejection = null;
        }

        const total = m.rejected_non_ksa + m.rejected_vpn + m.rejected_bot;
        if (!total) {
            ctx.parentElement.innerHTML = emptyState("No rejected traffic in this range.");
            return;
        }

        state.charts.rejection = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Non-KSA", "VPN / Proxy", "Bot"],
                datasets: [{
                    data: [m.rejected_non_ksa, m.rejected_vpn, m.rejected_bot],
                    backgroundColor: ["#B45309", "#B91C1C", "#5C7280"],
                    borderWidth: 2,
                    borderColor: "#F8FAFB",
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "right",
                        labels: { font: { size: 12, weight: "700" }, padding: 16, color: "#1A2B33" },
                    },
                    tooltip: {
                        callbacks: {
                            label(ctx) {
                                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                                return ` ${ctx.label}: ${fmtNumber(ctx.parsed)} (${pct}%)`;
                            },
                        },
                    },
                },
            },
        });
    }

    /* Orders table */
    function renderOrders() {
        const count = state.orders.length;
        setText(els["orders-count"], count ? `${count} orders found` : "");
        // Update nav badge
        const badge = $("nav-orders-badge");
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 999 ? "999+" : String(count);
                badge.classList.remove("hidden");
            } else {
                badge.classList.add("hidden");
            }
        }

        if (!count) {
            els["orders-table"].innerHTML = `<div class="p-10">${emptyState("No orders match this filter.")}</div>`;
            return;
        }

        els["orders-table"].innerHTML = state.orders.map(o => `
            <div class="grid grid-cols-12 items-center gap-3 px-5 py-4 text-sm hover:bg-secondary/30 transition-colors cursor-pointer group"
                 data-preview-order="${esc(o.id)}">
                <!-- Order # + date -->
                <div class="col-span-6 lg:col-span-2 min-w-0">
                    <strong class="block text-primary font-bold truncate">${esc(o.order_number)}</strong>
                    <span class="text-[11px] font-semibold text-muted">${fmtDateTime(o.created_at)}</span>
                </div>
                <!-- Customer -->
                <div class="col-span-6 lg:col-span-3 min-w-0">
                    <strong class="block truncate font-semibold text-charcoal">${esc(o.customer_name)}</strong>
                    <span class="text-[11px] font-semibold text-muted">${esc(o.phone)} · ${esc(o.city)}</span>
                </div>
                <!-- Date (shown on large) -->
                <div class="hidden lg:block lg:col-span-2">
                    <span class="text-[11px] font-semibold text-muted">${fmtDate(o.created_at)}</span>
                </div>
                <!-- Status -->
                <div class="col-span-4 lg:col-span-2">${statusPill(o.status)}</div>
                <!-- Total -->
                <div class="col-span-4 lg:col-span-2 font-extrabold text-charcoal">${fmtMoney(o.total)}</div>
                <!-- Action -->
                <div class="col-span-4 lg:col-span-1 flex justify-end">
                    <button class="rounded-xl bg-primary/10 text-primary px-3 py-1.5 text-[11px] font-extrabold group-hover:bg-primary group-hover:text-cream transition"
                            data-preview-order="${esc(o.id)}">View</button>
                </div>
            </div>`).join("");
    }

    /* Recent orders widget */
    function renderRecentOrders() {
        const orders = (state.orders.length ? state.orders : (state.dashboard?.orders || [])).slice(0, 6);
        if (!orders.length) {
            els["recent-orders"].innerHTML = emptyState("No recent orders.");
            return;
        }
        els["recent-orders"].innerHTML = orders.map(o => `
            <button class="w-full text-left rounded-2xl border border-primary/10 bg-cream px-4 py-3 hover:border-primary/30 hover:bg-secondary/50 transition"
                    data-preview-order="${esc(o.id)}">
                <div class="flex items-center justify-between gap-2">
                    <strong class="text-sm font-bold text-primary truncate">${esc(o.order_number)}</strong>
                    ${statusPill(o.status)}
                </div>
                <p class="mt-1.5 text-xs font-semibold text-muted truncate">
                    ${esc(o.customer_name)} · ${fmtMoney(o.total)} · ${esc(o.city)}
                </p>
            </button>`).join("");
    }

    /* ── Order preview drawer ────────────────────────────────────────────────── */

    function renderOrderPreview(order, loading, error) {
        if (error) {
            els["order-preview"].innerHTML = drawerShell(null, emptyState(error));
            return;
        }
        if (!order) {
            els["order-preview"].innerHTML = drawerShell(null,
                emptyState(loading ? "Loading order…" : "Order not found."));
            return;
        }

        const itemsHtml = order.items.length
            ? order.items.map(item => `
                <div class="flex items-center justify-between gap-4 rounded-2xl bg-cream border border-primary/8 p-4">
                    <div class="min-w-0">
                        <strong class="block text-sm font-bold text-charcoal truncate">${esc(item.name)}</strong>
                        ${item.sku ? `<span class="text-[10px] font-bold text-muted uppercase tracking-wider">${esc(item.sku)}</span>` : ""}
                    </div>
                    <div class="text-right flex-shrink-0">
                        <strong class="block text-primary font-extrabold">${fmtMoney(item.price)}</strong>
                        <span class="text-xs font-bold text-muted">× ${fmtNumber(item.quantity)}</span>
                    </div>
                </div>`).join("")
            : emptyState("No items returned.");

        const flagStr = order.traffic_validated === null
            ? "—"
            : order.traffic_validated
                ? '<span class="text-success font-extrabold">✓ Valid KSA</span>'
                : '<span class="text-danger font-extrabold">✗ Not validated</span>';

        const vpnStr = order.vpn_detected === null
            ? "—"
            : order.vpn_detected
                ? '<span class="text-danger font-extrabold">⚠ VPN detected</span>'
                : '<span class="text-success font-extrabold">✓ Clean IP</span>';

        const statusOptions = Object.entries(STATUS_META).map(([val, meta]) =>
            `<option value="${val}" ${order.status === val ? "selected" : ""}>${meta.label}</option>`
        ).join("");

        const body = `
            <div class="space-y-5 p-5">

                <!-- Hero header -->
                <div class="rounded-[1.75rem] bg-primary p-5 text-cream">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="text-[10px] font-extrabold uppercase tracking-[0.22em] text-secondary/70 mb-1">COD Order</p>
                            <h2 class="text-2xl font-extrabold tracking-tight truncate">${esc(order.order_number)}</h2>
                            <p class="mt-1 text-xs font-semibold text-secondary/70">${fmtDateTime(order.created_at)}</p>
                        </div>
                        ${statusPill(order.status, true)}
                    </div>
                    <div class="mt-5 grid grid-cols-2 gap-3">
                        <div class="rounded-2xl bg-white/12 p-4">
                            <span class="text-[10px] font-extrabold uppercase tracking-wider text-secondary/60">Total</span>
                            <strong class="mt-1 block text-2xl font-extrabold">${fmtMoney(order.total)}</strong>
                        </div>
                        <div class="rounded-2xl bg-white/12 p-4">
                            <span class="text-[10px] font-extrabold uppercase tracking-wider text-secondary/60">Payment</span>
                            <strong class="mt-1 block text-base font-extrabold">Cash on Delivery</strong>
                        </div>
                    </div>
                </div>

                <!-- Status update -->
                <div class="rounded-[1.75rem] border border-primary/10 bg-white p-5">
                    <h3 class="text-sm font-extrabold text-primary mb-3">Update status</h3>
                    <div class="flex gap-2">
                        <select id="preview-status-select" class="flex-1 rounded-2xl border border-primary/15 bg-cream px-3 py-2.5 text-sm font-bold text-charcoal focus:border-accent focus:outline-none">
                            ${statusOptions}
                        </select>
                        <button id="preview-status-save"
                            data-order-id="${esc(order.id)}"
                            class="rounded-2xl bg-primary px-4 py-2.5 text-sm font-extrabold text-cream hover:bg-primary/90 transition active:scale-95 flex-shrink-0">
                            Save
                        </button>
                    </div>
                    <textarea id="preview-status-note" rows="2" placeholder="Optional note…"
                        class="mt-2 w-full rounded-2xl border border-primary/12 bg-cream px-3 py-2.5 text-sm font-semibold text-charcoal resize-none focus:border-accent focus:outline-none">${esc(order.admin_note)}</textarea>
                    <p id="preview-status-feedback" class="mt-2 text-xs font-bold text-success hidden">Status updated ✓</p>
                </div>

                <!-- Customer info -->
                <div class="rounded-[1.75rem] border border-primary/10 bg-white p-5">
                    <h3 class="text-sm font-extrabold text-primary mb-4">Customer</h3>
                    <div class="grid grid-cols-2 gap-3">
                        ${detailCard("Name",  order.customer_name)}
                        ${detailCard("Phone", order.phone)}
                        ${detailCard("City",  order.city)}
                        ${detailCard("Source", order.source || "storefront")}
                        ${order.utm_campaign ? detailCard("Campaign", order.utm_campaign) : ""}
                        ${order.utm_source   ? detailCard("UTM Source", order.utm_source) : ""}
                    </div>
                </div>

                <!-- Items -->
                <div class="rounded-[1.75rem] border border-primary/10 bg-white p-5">
                    <h3 class="text-sm font-extrabold text-primary mb-4">Items</h3>
                    <div class="space-y-2.5">${itemsHtml}</div>
                    <div class="mt-4 border-t border-dashed border-primary/15 pt-4 flex items-center justify-between">
                        <span class="text-sm font-bold text-muted">Subtotal</span>
                        <span class="text-sm font-bold text-charcoal">${fmtMoney(order.subtotal)}</span>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                        <span class="text-base font-extrabold text-primary">Total</span>
                        <span class="text-base font-extrabold text-primary">${fmtMoney(order.total)}</span>
                    </div>
                </div>

                <!-- Traffic validation -->
                <div class="rounded-[1.75rem] border border-primary/10 bg-white p-5">
                    <h3 class="text-sm font-extrabold text-primary mb-4">Traffic validation</h3>
                    <div class="grid grid-cols-2 gap-3">
                        ${detailCard("IP Country",     order.ip_country || "—")}
                        ${detailCard("KSA Validated",  flagStr, true)}
                        ${detailCard("VPN Check",      vpnStr, true)}
                        ${detailCard("Order ID",       order.id)}
                    </div>
                </div>

            </div>`;

        els["order-preview"].innerHTML = drawerShell(order.order_number, body);

        // Bind status update
        const saveBtn = $("preview-status-save");
        const feedback = $("preview-status-feedback");
        if (saveBtn) {
            saveBtn.addEventListener("click", async () => {
                const newStatus = $("preview-status-select").value;
                const note      = $("preview-status-note").value.trim();
                saveBtn.disabled = true;
                saveBtn.textContent = "Saving…";
                const ok = await updateOrderStatus(order.id, newStatus, note);
                saveBtn.disabled = false;
                saveBtn.textContent = "Save";
                if (ok && feedback) {
                    feedback.classList.remove("hidden");
                    setTimeout(() => feedback.classList.add("hidden"), 3000);
                }
                // Also persist note
                if (note !== order.admin_note) {
                    await updateOrderNote(order.id, note);
                }
            });
        }
    }

    function drawerShell(title, content) {
        return `
            <div class="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-cream/96 backdrop-blur-sm px-5 py-4 shadow-sm">
                <strong class="text-base font-extrabold text-primary truncate">${title ? esc(title) : "Order details"}</strong>
                <button class="flex items-center gap-1.5 rounded-2xl border border-primary/12 bg-white px-3 py-2 text-xs font-extrabold text-primary hover:bg-secondary transition"
                        data-close-order>
                    <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                    Close
                </button>
            </div>
            ${content}`;
    }

    function detailCard(label, value, raw = false) {
        return `
            <div class="rounded-2xl bg-cream border border-primary/6 p-3">
                <span class="text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted">${esc(label)}</span>
                <div class="mt-1 text-sm font-bold text-charcoal break-words leading-5">${raw ? value : esc(String(value || "—"))}</div>
            </div>`;
    }

    /* ── Tab switching ───────────────────────────────────────────────────────── */

    const TAB_TITLES = {
        overview: "Overview",
        orders:   "Orders",
        products: "Products",
        traffic:  "Traffic Quality",
    };

    function switchTab(tab) {
        state.activeTab = tab;
        document.querySelectorAll("[data-tab-target]").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.tabTarget === tab);
        });
        document.querySelectorAll("[data-tab-panel]").forEach(panel => {
            panel.classList.toggle("hidden", panel.dataset.tabPanel !== tab);
        });
        if (els["page-title"]) els["page-title"].textContent = TAB_TITLES[tab] || tab;
        closeSidebar();
    }

    /* ── Auth ───────────────────────────────────────────────────────────────── */

    function updateAuthUi() {
        els["login-modal"].classList.toggle("hidden", !!state.credentials);
        if (!state.credentials) els["admin-password"].value = "";
    }

    function handleAuthError() {
        sessionStorage.removeItem("mymizan_admin_auth");
        state.credentials = null;
        updateAuthUi();
        els["login-error"].textContent = "Session expired. Please log in again.";
        showEl(els["login-error"]);
    }

    function getStoredCredentials() {
        try {
            const raw = sessionStorage.getItem("mymizan_admin_auth");
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    }

    /* ── UI helpers ─────────────────────────────────────────────────────────── */

    function setLoading(on) {
        const btn   = els["refresh-dashboard"];
        const label = els["refresh-label"];
        const icon  = els["refresh-icon"];
        btn.disabled = on;
        if (label) label.textContent = on ? "Loading…" : "Refresh";
        if (icon) icon.classList.toggle("animate-spin", on);
    }

    function showAlert(type, msg) {
        const el = els["admin-alert"];
        el.textContent = msg;
        el.className = `mx-0 mt-0 mb-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
            type === "error"
                ? "border-danger/20 bg-danger/8 text-danger"
                : "border-success/20 bg-success/8 text-success"
        }`;
        showEl(el);
    }

    function hideAlert() { hideEl(els["admin-alert"]); }
    function showEl(el) { if (el) el.classList.remove("hidden"); }
    function hideEl(el) { if (el) el.classList.add("hidden"); }
    function setText(el, text) { if (el) el.textContent = text; }

    /* ── Formatters ─────────────────────────────────────────────────────────── */

    function fmtNumber(v) {
        return new Intl.NumberFormat("en-SA").format(num(v));
    }

    function fmtMoney(v) {
        return new Intl.NumberFormat("en-SA", {
            style: "currency", currency: "SAR", maximumFractionDigits: 0,
        }).format(num(v));
    }

    function fmtPct(v) {
        const n = num(v);
        const p = n > 1 ? n : n * 100;
        return `${p.toFixed(p >= 10 ? 1 : 2)}%`;
    }

    function fmtDateTime(v) {
        if (!v) return "—";
        const d = new Date(v);
        if (isNaN(d.getTime())) return String(v);
        return new Intl.DateTimeFormat("en-SA", { dateStyle: "medium", timeStyle: "short" }).format(d);
    }

    function fmtDate(v) {
        if (!v) return "—";
        const d = new Date(v);
        if (isNaN(d.getTime())) return String(v);
        return new Intl.DateTimeFormat("en-SA", { dateStyle: "medium" }).format(d);
    }

    /* ── Status pill ────────────────────────────────────────────────────────── */

    function statusPill(status, inverted = false) {
        const colors = {
            pending:   inverted ? "bg-white/15 text-cream"          : "bg-amber-50 text-amber-700 border border-amber-200",
            confirmed: inverted ? "bg-white/15 text-cream"          : "bg-blue-50 text-blue-700 border border-blue-200",
            shipped:   inverted ? "bg-white/15 text-cream"          : "bg-violet-50 text-violet-700 border border-violet-200",
            delivered: inverted ? "bg-white/15 text-cream"          : "bg-green-50 text-green-700 border border-green-200",
            cancelled: inverted ? "bg-white/15 text-cream"          : "bg-red-50 text-red-700 border border-red-200",
            returned:  inverted ? "bg-white/15 text-cream"          : "bg-gray-100 text-gray-600 border border-gray-200",
        };
        const cls = colors[status] || colors.pending;
        const label = STATUS_META[status]?.label || status || "pending";
        return `<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${cls}">
            <span class="h-1.5 w-1.5 rounded-full inline-block" style="background:${STATUS_META[status]?.hex || "#5C7280"}"></span>
            ${esc(label)}</span>`;
    }

    /* ── Misc utils ─────────────────────────────────────────────────────────── */

    function emptyState(msg) {
        return `<div class="rounded-2xl border border-dashed border-primary/15 bg-secondary/20 p-8 text-center text-sm font-bold text-muted">${esc(msg)}</div>`;
    }

    function esc(v) {
        return String(v ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function num(v) {
        const n = Number(v);
        return isFinite(n) ? n : 0;
    }

    function safeRate(n, d) { return d ? n / d : 0; }

    function debounce(fn, ms) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    }

})();
