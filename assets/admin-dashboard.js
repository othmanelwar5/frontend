(function() {
    const configuredApiUrl = typeof window.MYMIZAN_API_URL === "string" ? window.MYMIZAN_API_URL.trim() : "";
    const API_BASE = (configuredApiUrl || "https://api.mymizan.shop").replace(/\/+$/, "");

    const productNames = {
        "d3-k2-gummies": "D3 + K2 Gummies",
        "sleep-tea": "Sleep Tea",
        "probiotic-fiber-gummies": "Probiotic + Fiber Gummies"
    };

    const state = {
        credentials: getStoredCredentials(),
        dashboard: null,
        orders: [],
        selectedOrder: null
    };

    const els = {};

    document.addEventListener("DOMContentLoaded", () => {
        cacheElements();
        setDefaultDates();
        bindEvents();
        updateAuthUi();
        if (state.credentials) {
            loadDashboard();
        }
    });

    function cacheElements() {
        [
            "date-from", "date-to", "refresh-dashboard", "logout-admin", "admin-alert",
            "login-modal", "login-form", "admin-username", "admin-password", "login-error",
            "metric-clicks", "metric-clicks-note", "metric-orders", "metric-orders-note",
            "metric-conversion", "metric-revenue", "metric-aov", "daily-chart", "funnel-list",
            "top-products", "recent-orders", "orders-status", "orders-search", "orders-table",
            "product-breakdown", "traffic-quality", "order-drawer", "order-preview"
        ].forEach((id) => {
            els[id] = document.getElementById(id);
        });
    }

    function bindEvents() {
        els["login-form"].addEventListener("submit", async (event) => {
            event.preventDefault();
            const username = els["admin-username"].value.trim();
            const password = els["admin-password"].value;
            if (!username || !password) return;

            els["login-error"].classList.add("hidden");
            const previousCredentials = state.credentials;
            state.credentials = { username, password };

            try {
                await apiFetch("/admin/session");
                sessionStorage.setItem("mymizan_admin_auth", JSON.stringify(state.credentials));
                updateAuthUi();
                loadDashboard();
            } catch (error) {
                state.credentials = previousCredentials;
                sessionStorage.removeItem("mymizan_admin_auth");
                els["login-error"].textContent = error.status === 503
                    ? "Admin credentials are not configured on the backend."
                    : "Invalid admin username or password.";
                els["login-error"].classList.remove("hidden");
            }
        });

        els["logout-admin"].addEventListener("click", () => {
            sessionStorage.removeItem("mymizan_admin_auth");
            state.credentials = null;
            updateAuthUi();
        });

        els["refresh-dashboard"].addEventListener("click", loadDashboard);
        els["date-from"].addEventListener("change", loadDashboard);
        els["date-to"].addEventListener("change", loadDashboard);
        els["orders-status"].addEventListener("change", loadOrders);
        els["orders-search"].addEventListener("input", debounce(loadOrders, 300));

        document.querySelectorAll("[data-tab-target]").forEach((button) => {
            button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
        });

        els["orders-table"].addEventListener("click", (event) => {
            const button = event.target.closest("[data-preview-order]");
            if (!button) return;
            openOrderPreview(button.dataset.previewOrder);
        });

        els["recent-orders"].addEventListener("click", (event) => {
            const button = event.target.closest("[data-preview-order]");
            if (!button) return;
            openOrderPreview(button.dataset.previewOrder);
        });

        els["order-drawer"].addEventListener("click", (event) => {
            if (event.target.closest("[data-close-order]")) {
                closeOrderPreview();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeOrderPreview();
        });
    }

    function setDefaultDates() {
        const today = new Date();
        const from = new Date();
        from.setDate(today.getDate() - 6);
        els["date-from"].value = formatDateInput(from);
        els["date-to"].value = formatDateInput(today);
    }

    async function loadDashboard() {
        if (!state.credentials) return;
        setLoading(true);
        hideAlert();
        try {
            const query = dateQuery();
            const dashboard = await apiFetch(`/admin/dashboard?${query}`).catch(async () => {
                return apiFetch(`/admin/metrics?${query}`);
            });
            state.dashboard = normalizeDashboard(dashboard);
            renderDashboard();
            await loadOrders();
            els["login-error"].classList.add("hidden");
        } catch (error) {
            showAlert("error", error.message || "Could not load admin dashboard.");
            if (error.status === 401 || error.status === 403) {
                sessionStorage.removeItem("mymizan_admin_auth");
                state.credentials = null;
                updateAuthUi();
                els["login-error"].textContent = "Invalid admin username or password.";
                els["login-error"].classList.remove("hidden");
            }
        } finally {
            setLoading(false);
        }
    }

    async function loadOrders() {
        if (!state.credentials) return;
        try {
            const params = new URLSearchParams(dateParams());
            const status = els["orders-status"].value;
            const search = els["orders-search"].value.trim();
            if (status) params.set("status", status);
            if (search) params.set("search", search);
            params.set("limit", "100");

            const response = await apiFetch(`/admin/orders?${params.toString()}`);
            state.orders = normalizeOrders(response.orders || response.data || response);
            renderOrders();
            renderRecentOrders();
        } catch (error) {
            showAlert("error", error.message || "Could not load orders.");
            state.orders = [];
            renderOrders();
            renderRecentOrders();
        }
    }

    async function openOrderPreview(orderId) {
        const existing = state.orders.find((order) => String(order.id) === String(orderId) || String(order.order_number) === String(orderId));
        state.selectedOrder = existing || null;
        renderOrderPreview(state.selectedOrder, true);
        els["order-drawer"].classList.remove("hidden");

        try {
            const fresh = await apiFetch(`/admin/orders/${encodeURIComponent(orderId)}`);
            state.selectedOrder = normalizeOrder(fresh.order || fresh.data || fresh);
            renderOrderPreview(state.selectedOrder, false);
        } catch (error) {
            if (!existing) {
                renderOrderPreview(null, false, error.message || "Could not load order.");
            }
        }
    }

    function closeOrderPreview() {
        els["order-drawer"].classList.add("hidden");
        state.selectedOrder = null;
    }

    async function apiFetch(path) {
        const response = await fetch(`${API_BASE}${path}`, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Basic ${btoa(`${state.credentials.username}:${state.credentials.password}`)}`
            },
            credentials: "omit"
        });

        if (!response.ok) {
            const error = new Error(await response.text() || `Request failed with ${response.status}`);
            error.status = response.status;
            throw error;
        }

        return response.json();
    }

    function normalizeDashboard(payload) {
        const metrics = payload.metrics || payload.summary || payload;
        const orders = normalizeOrders(payload.orders || []);
        const clicks = number(metrics.valid_clicks ?? metrics.clicks ?? metrics.cta_clicks ?? 0);
        const orderCount = number(metrics.orders ?? metrics.order_count ?? orders.length);
        const revenue = number(metrics.revenue ?? metrics.total_revenue ?? metrics.gmv ?? sum(orders, "total"));
        const aov = number(metrics.aov ?? (orderCount ? revenue / orderCount : 0));

        return {
            metrics: {
                clicks,
                page_views: number(metrics.page_views ?? 0),
                product_views: number(metrics.product_views ?? 0),
                checkout_opens: number(metrics.checkout_opens ?? metrics.checkout_started ?? 0),
                orders: orderCount,
                revenue,
                aov,
                conversion_rate: metrics.conversion_rate != null ? number(metrics.conversion_rate) : safeRate(orderCount, clicks),
                rejected_non_ksa: number(metrics.rejected_non_ksa ?? metrics.non_ksa_rejected ?? 0),
                rejected_vpn: number(metrics.rejected_vpn ?? metrics.vpn_rejected ?? 0),
                rejected_bot: number(metrics.rejected_bot ?? metrics.bot_rejected ?? 0),
                valid_sessions: number(metrics.valid_sessions ?? 0)
            },
            series: normalizeSeries(payload.series || payload.daily || []),
            products: normalizeProducts(payload.products || payload.product_breakdown || []),
            funnel: normalizeFunnel(payload.funnel || metrics),
            orders
        };
    }

    function normalizeOrders(input) {
        if (!Array.isArray(input)) return [];
        return input.map(normalizeOrder);
    }

    function normalizeOrder(order) {
        const items = Array.isArray(order.items) ? order.items : [];
        return {
            id: order.id ?? order.order_id ?? order.order_number,
            order_number: order.order_number ?? order.order_id ?? order.id ?? "-",
            created_at: order.created_at ?? order.date ?? order.createdAt ?? null,
            customer_name: order.customer_name ?? order.name ?? order.customer?.name ?? "-",
            phone: order.phone ?? order.customer_phone ?? order.customer?.phone ?? "-",
            city: order.city ?? order.customer?.city ?? "-",
            status: (order.status || "pending").toLowerCase(),
            total: number(order.total ?? order.total_sar ?? order.amount ?? 0),
            subtotal: number(order.subtotal ?? order.total ?? 0),
            currency: order.currency || "SAR",
            source: order.source || order.utm_source || "storefront",
            utm_campaign: order.utm_campaign || order.campaign || "",
            ip_country: order.ip_country || order.country || "SA",
            traffic_validated: order.traffic_validated ?? order.valid_traffic ?? null,
            vpn_detected: order.vpn_detected ?? order.is_vpn ?? null,
            items: items.map((item) => ({
                product_slug: item.product_slug || item.slug || item.sku || "",
                name: item.name || productNames[item.product_slug || item.slug] || item.product || "Product",
                quantity: number(item.quantity ?? item.qty ?? 1),
                price: number(item.price ?? item.unit_price ?? item.total ?? 0),
                sku: item.sku || ""
            })),
            raw: order
        };
    }

    function normalizeSeries(input) {
        if (!Array.isArray(input)) return [];
        return input.map((row) => ({
            date: row.date || row.day || "",
            clicks: number(row.valid_clicks ?? row.clicks ?? 0),
            orders: number(row.orders ?? row.order_count ?? 0),
            revenue: number(row.revenue ?? row.gmv ?? 0)
        }));
    }

    function normalizeProducts(input) {
        if (!Array.isArray(input)) return [];
        return input.map((row) => {
            const slug = row.product_slug || row.slug || row.sku || "";
            const clicks = number(row.valid_clicks ?? row.clicks ?? 0);
            const orders = number(row.orders ?? row.order_count ?? 0);
            return {
                slug,
                name: row.name || productNames[slug] || slug || "Product",
                sku: row.sku || "",
                clicks,
                orders,
                revenue: number(row.revenue ?? row.gmv ?? 0),
                conversion_rate: row.conversion_rate != null ? number(row.conversion_rate) : safeRate(orders, clicks)
            };
        });
    }

    function normalizeFunnel(funnel) {
        const pageViews = number(funnel.page_views ?? 0);
        const productViews = number(funnel.product_views ?? pageViews);
        const clicks = number(funnel.valid_clicks ?? funnel.clicks ?? funnel.cta_clicks ?? 0);
        const checkout = number(funnel.checkout_opens ?? funnel.checkout_started ?? 0);
        const orders = number(funnel.orders ?? funnel.order_count ?? 0);
        return [
            { label: "Page views", value: pageViews },
            { label: "Product views", value: productViews },
            { label: "Valid clicks", value: clicks },
            { label: "Checkout opens", value: checkout },
            { label: "Orders", value: orders }
        ].filter((item) => item.value > 0 || item.label === "Orders");
    }

    function renderDashboard() {
        const data = state.dashboard || normalizeDashboard({});
        const metrics = data.metrics;
        els["metric-clicks"].textContent = formatNumber(metrics.clicks);
        els["metric-orders"].textContent = formatNumber(metrics.orders);
        els["metric-conversion"].textContent = formatPercent(metrics.conversion_rate);
        els["metric-revenue"].textContent = formatMoney(metrics.revenue);
        els["metric-aov"].textContent = `AOV ${formatMoney(metrics.aov)}`;
        els["metric-clicks-note"].textContent = `${formatNumber(metrics.page_views)} page views`;
        els["metric-orders-note"].textContent = `${formatNumber(metrics.checkout_opens)} checkout opens`;
        renderDailyChart(data.series);
        renderFunnel(data.funnel);
        renderProducts(data.products);
        renderTrafficQuality(metrics);
        renderRecentOrders();
    }

    function renderDailyChart(series) {
        if (!series.length) {
            els["daily-chart"].innerHTML = emptyState("No daily metrics returned yet.");
            return;
        }
        const max = Math.max(...series.map((row) => Math.max(row.clicks, row.orders, row.revenue / 10)), 1);
        els["daily-chart"].innerHTML = series.map((row) => {
            const clickWidth = Math.max(4, (row.clicks / max) * 100);
            const orderWidth = Math.max(4, (row.orders / max) * 100);
            return `
                <div class="rounded-2xl border border-primary/10 bg-cream p-4">
                    <div class="mb-3 flex items-center justify-between gap-4">
                        <strong class="text-sm text-primary">${escapeHtml(row.date || "-")}</strong>
                        <span class="text-xs font-bold text-muted">${formatMoney(row.revenue)} revenue</span>
                    </div>
                    <div class="space-y-2">
                        <div class="admin-bar-row"><span>Clicks</span><div><i style="width:${clickWidth}%"></i></div><b>${formatNumber(row.clicks)}</b></div>
                        <div class="admin-bar-row orders"><span>Orders</span><div><i style="width:${orderWidth}%"></i></div><b>${formatNumber(row.orders)}</b></div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function renderFunnel(funnel) {
        if (!funnel.length) {
            els["funnel-list"].innerHTML = emptyState("No funnel data yet.");
            return;
        }
        const max = Math.max(...funnel.map((step) => step.value), 1);
        els["funnel-list"].innerHTML = funnel.map((step, index) => {
            const width = Math.max(8, (step.value / max) * 100);
            const previous = index > 0 ? funnel[index - 1].value : step.value;
            return `
                <div>
                    <div class="mb-2 flex items-center justify-between text-sm font-bold">
                        <span>${escapeHtml(step.label)}</span>
                        <span class="text-primary">${formatNumber(step.value)}</span>
                    </div>
                    <div class="h-3 overflow-hidden rounded-full bg-secondary">
                        <div class="h-full rounded-full bg-accent" style="width:${width}%"></div>
                    </div>
                    <p class="mt-1 text-xs font-semibold text-muted">${index === 0 ? "100%" : formatPercent(safeRate(step.value, previous))} from previous step</p>
                </div>
            `;
        }).join("");
    }

    function renderProducts(products) {
        const sorted = [...products].sort((a, b) => b.revenue - a.revenue || b.orders - a.orders);
        if (!sorted.length) {
            els["top-products"].innerHTML = emptyState("No product data yet.");
            els["product-breakdown"].innerHTML = emptyState("No product data yet.");
            return;
        }

        els["top-products"].innerHTML = sorted.slice(0, 5).map((product) => `
            <div class="flex items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-cream p-4">
                <div>
                    <strong class="block text-primary">${escapeHtml(product.name)}</strong>
                    <span class="text-xs font-bold text-muted">${formatNumber(product.orders)} orders · ${formatPercent(product.conversion_rate)} CVR</span>
                </div>
                <span class="text-sm font-extrabold text-success">${formatMoney(product.revenue)}</span>
            </div>
        `).join("");

        els["product-breakdown"].innerHTML = sorted.map((product) => `
            <article class="rounded-3xl border border-primary/10 bg-white p-5">
                <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-accent">${escapeHtml(product.sku || product.slug || "SKU")}</p>
                <h3 class="mt-2 text-lg font-extrabold text-primary">${escapeHtml(product.name)}</h3>
                <dl class="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div class="rounded-2xl bg-secondary/60 p-3"><dt class="font-bold text-muted">Clicks</dt><dd class="text-xl font-extrabold text-charcoal">${formatNumber(product.clicks)}</dd></div>
                    <div class="rounded-2xl bg-secondary/60 p-3"><dt class="font-bold text-muted">Orders</dt><dd class="text-xl font-extrabold text-charcoal">${formatNumber(product.orders)}</dd></div>
                    <div class="rounded-2xl bg-secondary/60 p-3"><dt class="font-bold text-muted">CVR</dt><dd class="text-xl font-extrabold text-charcoal">${formatPercent(product.conversion_rate)}</dd></div>
                    <div class="rounded-2xl bg-secondary/60 p-3"><dt class="font-bold text-muted">Revenue</dt><dd class="text-xl font-extrabold text-charcoal">${formatMoney(product.revenue)}</dd></div>
                </dl>
            </article>
        `).join("");
    }

    function renderTrafficQuality(metrics) {
        const cards = [
            ["Valid sessions", metrics.valid_sessions, "Passed KSA and VPN checks"],
            ["Rejected non-KSA", metrics.rejected_non_ksa, "Country not SA"],
            ["Rejected VPN/proxy", metrics.rejected_vpn, "MaxMind/provider anonymous flags"],
            ["Rejected bots", metrics.rejected_bot, "Bot or automation signals"]
        ];
        els["traffic-quality"].innerHTML = cards.map(([label, value, note]) => `
            <article class="rounded-3xl border border-primary/10 bg-white p-5">
                <span class="text-xs font-extrabold uppercase tracking-[0.16em] text-muted">${escapeHtml(label)}</span>
                <strong class="mt-3 block text-3xl font-extrabold text-primary">${formatNumber(value)}</strong>
                <p class="mt-2 text-sm font-semibold leading-6 text-muted">${escapeHtml(note)}</p>
            </article>
        `).join("");
    }

    function renderOrders() {
        if (!state.orders.length) {
            els["orders-table"].innerHTML = `<div class="p-8">${emptyState("No orders for this filter.")}</div>`;
            return;
        }
        els["orders-table"].innerHTML = state.orders.map((order) => `
            <div class="grid grid-cols-12 items-center gap-4 px-5 py-4 text-sm">
                <div class="col-span-3">
                    <strong class="block text-primary">${escapeHtml(order.order_number)}</strong>
                    <span class="text-xs font-semibold text-muted">${formatDateTime(order.created_at)}</span>
                </div>
                <div class="col-span-3">
                    <strong class="block">${escapeHtml(order.customer_name)}</strong>
                    <span class="text-xs font-semibold text-muted">${escapeHtml(order.phone)}</span>
                </div>
                <div class="col-span-2">${statusPill(order.status)}</div>
                <div class="col-span-2 font-extrabold text-charcoal">${formatMoney(order.total)}</div>
                <div class="col-span-2 text-right">
                    <button class="rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-cream" data-preview-order="${escapeHtml(order.id)}">Preview</button>
                </div>
            </div>
        `).join("");
    }

    function renderRecentOrders() {
        const orders = state.orders.length ? state.orders.slice(0, 5) : (state.dashboard?.orders || []).slice(0, 5);
        if (!orders.length) {
            els["recent-orders"].innerHTML = emptyState("No recent orders yet.");
            return;
        }
        els["recent-orders"].innerHTML = orders.map((order) => `
            <button class="w-full rounded-2xl border border-primary/10 bg-cream p-4 text-left transition hover:border-primary/30 hover:bg-secondary/60" data-preview-order="${escapeHtml(order.id)}">
                <span class="flex items-center justify-between gap-3">
                    <strong class="text-primary">${escapeHtml(order.order_number)}</strong>
                    ${statusPill(order.status)}
                </span>
                <span class="mt-2 block text-sm font-semibold text-charcoal">${escapeHtml(order.customer_name)} · ${formatMoney(order.total)}</span>
            </button>
        `).join("");
    }

    function renderOrderPreview(order, loading, error) {
        if (error) {
            els["order-preview"].innerHTML = drawerShell(`<div class="p-6">${emptyState(error)}</div>`);
            return;
        }
        if (!order) {
            els["order-preview"].innerHTML = drawerShell(`<div class="p-6">${emptyState(loading ? "Loading order..." : "Order not found.")}</div>`);
            return;
        }

        const items = order.items.length ? order.items : [{ name: "Order items not returned", quantity: 1, price: order.total }];
        els["order-preview"].innerHTML = drawerShell(`
            <div class="space-y-6 p-6 sm:p-8">
                <div class="rounded-[2rem] bg-primary p-6 text-cream">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-sm font-bold text-secondary">Order preview</p>
                            <h2 class="mt-2 text-3xl font-extrabold">${escapeHtml(order.order_number)}</h2>
                            <p class="mt-2 text-sm font-semibold text-secondary">${formatDateTime(order.created_at)}</p>
                        </div>
                        ${statusPill(order.status, true)}
                    </div>
                    <div class="mt-6 grid grid-cols-2 gap-3">
                        <div class="rounded-2xl bg-white/10 p-4">
                            <span class="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Total</span>
                            <strong class="mt-1 block text-2xl font-extrabold">${formatMoney(order.total)}</strong>
                        </div>
                        <div class="rounded-2xl bg-white/10 p-4">
                            <span class="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Payment</span>
                            <strong class="mt-1 block text-lg font-extrabold">Cash on delivery</strong>
                        </div>
                    </div>
                </div>

                <section class="rounded-[2rem] border border-primary/10 bg-white p-6">
                    <h3 class="text-lg font-extrabold text-primary">Customer</h3>
                    <div class="mt-5 grid gap-4 sm:grid-cols-2">
                        ${detail("Name", order.customer_name)}
                        ${detail("Phone", order.phone)}
                        ${detail("City", order.city)}
                        ${detail("Source", order.source)}
                    </div>
                </section>

                <section class="rounded-[2rem] border border-primary/10 bg-white p-6">
                    <h3 class="text-lg font-extrabold text-primary">Items</h3>
                    <div class="mt-5 space-y-3">
                        ${items.map((item) => `
                            <div class="flex items-center justify-between gap-4 rounded-2xl bg-cream p-4">
                                <div>
                                    <strong class="block text-charcoal">${escapeHtml(item.name)}</strong>
                                    <span class="text-xs font-bold text-muted">${escapeHtml(item.sku || item.product_slug || "")}</span>
                                </div>
                                <div class="text-right">
                                    <strong class="block text-primary">${formatMoney(item.price)}</strong>
                                    <span class="text-xs font-bold text-muted">Qty ${formatNumber(item.quantity)}</span>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                    <div class="mt-5 border-t border-dashed border-primary/15 pt-5">
                        <div class="flex items-center justify-between text-lg font-extrabold text-primary">
                            <span>Total</span>
                            <span>${formatMoney(order.total)}</span>
                        </div>
                    </div>
                </section>

                <section class="rounded-[2rem] border border-primary/10 bg-white p-6">
                    <h3 class="text-lg font-extrabold text-primary">Traffic validation</h3>
                    <div class="mt-5 grid gap-4 sm:grid-cols-2">
                        ${detail("Country", order.ip_country)}
                        ${detail("Valid KSA traffic", order.traffic_validated === null ? "Not returned" : order.traffic_validated ? "Yes" : "No")}
                        ${detail("VPN detected", order.vpn_detected === null ? "Not returned" : order.vpn_detected ? "Yes" : "No")}
                        ${detail("Campaign", order.utm_campaign || "-")}
                    </div>
                </section>
            </div>
        `);
    }

    function drawerShell(content) {
        return `
            <div class="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-cream/98 p-5 shadow-sm">
                <strong class="text-lg font-extrabold text-primary">Order details</strong>
                <button class="rounded-2xl border border-primary/10 bg-white px-4 py-2 text-sm font-extrabold text-primary" data-close-order>Close</button>
            </div>
            ${content}
        `;
    }

    function detail(label, value) {
        return `
            <div class="rounded-2xl bg-cream p-4">
                <span class="text-xs font-extrabold uppercase tracking-[0.16em] text-muted">${escapeHtml(label)}</span>
                <strong class="mt-1 block break-words text-charcoal">${escapeHtml(value || "-")}</strong>
            </div>
        `;
    }

    function switchTab(tab) {
        document.querySelectorAll("[data-tab-target]").forEach((button) => {
            button.classList.toggle("active", button.dataset.tabTarget === tab);
        });
        document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
            panel.classList.toggle("hidden", panel.dataset.tabPanel !== tab);
        });
    }

    function updateAuthUi() {
        els["login-modal"].classList.toggle("hidden", !!state.credentials);
        if (!state.credentials) {
            els["admin-password"].value = "";
        }
    }

    function setLoading(isLoading) {
        els["refresh-dashboard"].disabled = isLoading;
        els["refresh-dashboard"].textContent = isLoading ? "Loading..." : "Refresh";
    }

    function getStoredCredentials() {
        try {
            const raw = sessionStorage.getItem("mymizan_admin_auth");
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function dateParams() {
        return {
            from: els["date-from"].value,
            to: els["date-to"].value
        };
    }

    function dateQuery() {
        return new URLSearchParams(dateParams()).toString();
    }

    function showAlert(type, message) {
        els["admin-alert"].textContent = message;
        els["admin-alert"].className = `mx-4 mt-4 rounded-2xl border px-4 py-3 text-sm font-bold sm:mx-6 lg:mx-8 ${type === "error" ? "border-danger/20 bg-danger/10 text-danger" : "border-success/20 bg-success/10 text-success"}`;
        els["admin-alert"].classList.remove("hidden");
    }

    function hideAlert() {
        els["admin-alert"].classList.add("hidden");
    }

    function statusPill(status, inverted) {
        const colors = {
            pending: inverted ? "bg-white text-primary" : "bg-accent/10 text-accent",
            confirmed: inverted ? "bg-white text-success" : "bg-success/10 text-success",
            shipped: inverted ? "bg-white text-primary" : "bg-primary/10 text-primary",
            delivered: inverted ? "bg-white text-success" : "bg-success/10 text-success",
            cancelled: inverted ? "bg-white text-danger" : "bg-danger/10 text-danger"
        };
        return `<span class="inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${colors[status] || colors.pending}">${escapeHtml(status || "pending")}</span>`;
    }

    function emptyState(message) {
        return `<div class="rounded-3xl border border-dashed border-primary/20 bg-secondary/30 p-6 text-center text-sm font-bold text-muted">${escapeHtml(message)}</div>`;
    }

    function formatDateInput(date) {
        return date.toISOString().slice(0, 10);
    }

    function formatDateTime(value) {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return String(value);
        return new Intl.DateTimeFormat("en-SA", { dateStyle: "medium", timeStyle: "short" }).format(date);
    }

    function formatNumber(value) {
        return new Intl.NumberFormat("en-SA").format(number(value));
    }

    function formatMoney(value) {
        return new Intl.NumberFormat("en-SA", { style: "currency", currency: "SAR", maximumFractionDigits: 0 }).format(number(value));
    }

    function formatPercent(value) {
        const normalized = number(value);
        const percent = normalized > 1 ? normalized : normalized * 100;
        return `${percent.toFixed(percent >= 10 ? 1 : 2)}%`;
    }

    function safeRate(numerator, denominator) {
        return denominator ? numerator / denominator : 0;
    }

    function sum(rows, key) {
        return rows.reduce((total, row) => total + number(row[key]), 0);
    }

    function number(value) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function debounce(fn, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})();
