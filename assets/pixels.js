(function () {
    "use strict";

    var CURRENCY = "SAR";
    var initialized = false;
    var initPromise = null;

    function getConfig() {
        return window.MYMIZAN_PIXEL_CONFIG || {};
    }

    function isTruthy(value) {
        if (value === false || value === "false" || value === "0") return false;
        return Boolean(value);
    }

    function isEnabled() {
        var cfg = getConfig();
        if (!isTruthy(cfg.enabled)) return false;
        return Boolean(
            (cfg.metaPixelId && String(cfg.metaPixelId).trim()) ||
            (cfg.tiktokPixelId && String(cfg.tiktokPixelId).trim()) ||
            (cfg.snapPixelId && String(cfg.snapPixelId).trim())
        );
    }

    function readCookie(name) {
        var match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"));
        return match ? decodeURIComponent(match[1]) : "";
    }

    function getUrlParam(name) {
        return new URLSearchParams(window.location.search).get(name) || "";
    }

    function getFbc() {
        var fbc = readCookie("_fbc");
        if (fbc) return fbc;
        var fbclid = getUrlParam("fbclid");
        if (!fbclid) return "";
        return "fb.1." + Date.now() + "." + fbclid;
    }

    function generateEventId(prefix) {
        return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
    }

    function loadScript(src, id) {
        return new Promise(function (resolve, reject) {
            if (id && document.getElementById(id)) {
                resolve();
                return;
            }
            var script = document.createElement("script");
            script.async = true;
            script.src = src;
            if (id) script.id = id;
            script.onload = function () { resolve(); };
            script.onerror = function () { reject(new Error("Failed to load " + src)); };
            document.head.appendChild(script);
        });
    }

    function initMeta(pixelId) {
        if (!pixelId || window.fbq) return;
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = true;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
        window.fbq("init", pixelId);
    }

    function initTikTok(pixelId) {
        if (!pixelId) return Promise.resolve();
        if (!window.ttq) {
            !function (w, d, t) {
                w.TiktokAnalyticsObject = t;
                var ttq = w[t] = w[t] || [];
                ttq.methods = [
                    "page", "track", "identify", "instances", "debug", "on", "off", "once", "ready",
                    "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"
                ];
                ttq.setAndDefer = function (obj, method) {
                    obj[method] = function () {
                        obj.push([method].concat(Array.prototype.slice.call(arguments, 0)));
                    };
                };
                for (var i = 0; i < ttq.methods.length; i++) {
                    ttq.setAndDefer(ttq, ttq.methods[i]);
                }
                ttq.instance = function (id) {
                    var inst = ttq._i[id] || [];
                    for (var j = 0; j < ttq.methods.length; j++) {
                        ttq.setAndDefer(inst, ttq.methods[j]);
                    }
                    return inst;
                };
                ttq.load = function (id, options) {
                    var src = "https://analytics.tiktok.com/i18n/pixel/events.js";
                    var partner = options && options.partner;
                    ttq._i = ttq._i || {};
                    ttq._i[id] = [];
                    ttq._i[id]._u = src;
                    ttq._t = ttq._t || {};
                    ttq._t[id + (partner ? "_" + partner : "")] = 1;
                    ttq._o = ttq._o || {};
                    ttq._o[id] = options || {};
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.async = true;
                    script.src = src + "?sdkid=" + id + "&lib=" + t;
                    var first = document.getElementsByTagName("script")[0];
                    first.parentNode.insertBefore(script, first);
                };
            }(window, document, "ttq");
        }

        window.ttq.load(pixelId);
        window.ttq.enableCookie();

        return new Promise(function (resolve) {
            var settled = false;
            function finish() {
                if (settled) return;
                settled = true;
                resolve();
            }
            window.ttq.ready(finish);
            setTimeout(finish, 4000);
        });
    }

    function initSnap(pixelId) {
        if (!pixelId || window.snaptr) return;
        (function (win, doc, src) {
            if (win.snaptr) return;
            var snaptr = win.snaptr = function () {
                snaptr.handleRequest ? snaptr.handleRequest.apply(snaptr, arguments) : snaptr.queue.push(arguments);
            };
            snaptr.queue = [];
            var script = doc.createElement("script");
            script.async = true;
            script.src = src;
            var first = doc.getElementsByTagName("script")[0];
            first.parentNode.insertBefore(script, first);
        })(window, document, "https://sc-static.net/scevent.min.js");
        window.snaptr("init", pixelId, {
            user_email: ""
        });
    }

    function ensureInitialized() {
        if (!isEnabled()) return Promise.resolve(false);
        if (initialized) return Promise.resolve(true);
        if (initPromise) return initPromise;

        var cfg = getConfig();
        var tasks = [Promise.resolve()];
        if (cfg.metaPixelId) tasks.push(Promise.resolve(initMeta(cfg.metaPixelId)));
        if (cfg.tiktokPixelId) tasks.push(initTikTok(cfg.tiktokPixelId));
        if (cfg.snapPixelId) tasks.push(Promise.resolve(initSnap(cfg.snapPixelId)));

        initPromise = Promise.all(tasks)
            .then(function () {
                initialized = true;
                return true;
            })
            .catch(function (error) {
                console.warn("[PIXELS] init failed", error);
                return false;
            });

        return initPromise;
    }

    function toContents(items) {
        return (items || []).map(function (item) {
            return {
                id: item.content_id || item.id,
                quantity: item.quantity || 1,
                item_price: item.price || item.value || 0
            };
        });
    }

    function trackAll(standardEvent, data) {
        if (!isEnabled()) return "";

        var cfg = getConfig();
        var eventId = data.eventId || generateEventId(standardEvent.toLowerCase());
        var value = Number(data.value || 0);
        var contentIds = data.content_ids || (data.content_id ? [data.content_id] : []);
        var contents = data.contents || (contentIds.length ? contentIds.map(function (id) {
            return {
                id: id,
                quantity: data.quantity || 1,
                item_price: data.price || value
            };
        }) : []);
        var numItems = data.num_items || contents.reduce(function (sum, item) {
            return sum + Number(item.quantity || 1);
        }, 0) || (data.quantity || 1);

        ensureInitialized().then(function () {
            if (cfg.metaPixelId && window.fbq) {
                var metaPayload = {
                    content_ids: contentIds,
                    content_type: data.content_type || "product",
                    contents: contents,
                    currency: CURRENCY,
                    value: value,
                    num_items: numItems
                };
                if (data.content_name) metaPayload.content_name = data.content_name;
                if (data.order_id) metaPayload.order_id = data.order_id;
                window.fbq("track", standardEvent, metaPayload, { eventID: eventId });
            }

            if (cfg.tiktokPixelId && window.ttq) {
                var tiktokEvent = standardEvent;
                if (standardEvent === "Purchase") tiktokEvent = "CompletePayment";

                var tiktokPayload = {
                    value: value,
                    currency: CURRENCY,
                    content_type: data.content_type || "product"
                };
                if (data.content_id) {
                    tiktokPayload.content_id = data.content_id;
                    tiktokPayload.content_name = data.content_name || "";
                }
                if (data.quantity) tiktokPayload.quantity = data.quantity;
                if (data.price) tiktokPayload.price = data.price;
                if (data.order_id) tiktokPayload.order_id = data.order_id;
                if (contents.length) {
                    tiktokPayload.contents = contents.map(function (item) {
                        return {
                            content_id: item.id,
                            content_type: "product",
                            quantity: item.quantity,
                            price: item.item_price
                        };
                    });
                }
                window.ttq.track(tiktokEvent, tiktokPayload, { event_id: eventId });
            }

            if (cfg.snapPixelId && window.snaptr) {
                var snapEvent = standardEvent;
                if (standardEvent === "PageView") snapEvent = "PAGE_VIEW";
                else if (standardEvent === "ViewContent") snapEvent = "VIEW_CONTENT";
                else if (standardEvent === "AddToCart") snapEvent = "ADD_CART";
                else if (standardEvent === "InitiateCheckout") snapEvent = "START_CHECKOUT";
                else if (standardEvent === "Purchase") snapEvent = "PURCHASE";

                var snapPayload = {
                    currency: CURRENCY,
                    price: value,
                    client_dedup_id: eventId
                };
                if (contentIds.length) snapPayload.item_ids = contentIds;
                if (data.content_name) snapPayload.description = data.content_name;
                if (data.quantity || numItems) snapPayload.number_items = data.quantity || numItems;
                if (data.order_id) snapPayload.transaction_id = data.order_id;
                window.snaptr("track", snapEvent, snapPayload);
            }
        });

        return eventId;
    }

    function trackPageView() {
        if (!isEnabled()) return;
        ensureInitialized().then(function () {
            var cfg = getConfig();
            if (cfg.metaPixelId && window.fbq) window.fbq("track", "PageView");
            if (cfg.tiktokPixelId && window.ttq) window.ttq.page();
            if (cfg.snapPixelId && window.snaptr) window.snaptr("track", "PAGE_VIEW");
        });
    }

    function trackViewContent(data) {
        return trackAll("ViewContent", data || {});
    }

    function trackAddToCart(data) {
        return trackAll("AddToCart", data || {});
    }

    function trackInitiateCheckout(data) {
        return trackAll("InitiateCheckout", data || {});
    }

    function trackPurchase(data) {
        return trackAll("Purchase", data || {});
    }

    function getTrackingContext(eventId) {
        return {
            event_id: eventId || generateEventId("purchase"),
            page_url: window.location.href,
            referrer: document.referrer || "",
            fbp: readCookie("_fbp"),
            fbc: getFbc(),
            ttclid: getUrlParam("ttclid") || readCookie("ttclid"),
            ttp: readCookie("_ttp"),
            sc_click_id: getUrlParam("ScCid") || readCookie("ScCid"),
            sc_cookie1: readCookie("_scid") || readCookie("sc_at"),
            user_agent: navigator.userAgent || ""
        };
    }

    window.MYMIZAN_PIXELS = {
        isEnabled: isEnabled,
        ensureInitialized: ensureInitialized,
        generateEventId: generateEventId,
        getTrackingContext: getTrackingContext,
        trackPageView: trackPageView,
        trackViewContent: trackViewContent,
        trackAddToCart: trackAddToCart,
        trackInitiateCheckout: trackInitiateCheckout,
        trackPurchase: trackPurchase
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            trackPageView();
        });
    } else {
        trackPageView();
    }
})();
