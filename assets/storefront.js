const products = {
    "d3-k2-gummies": {
        slug: "d3-k2-gummies",
        sku: "MZN-D3K2-8417",
        name: "حلوى فيتامين D3 و K2",
        image: "assets/products/d3-k2-gummies.webp",
        pageImages: {
            hero: "assets/product-pages/d3-hero.webp",
            authority: "assets/product-pages/d3-authority.webp",
            science: "assets/product-pages/d3-science.webp"
        },
        short: "لدعم مستويات فيتامين د وصحة العظام في ظل زحمة الروتين وقلة التعرض للشمس.",
        headline: "طاقة أعلى وعظام أقوى.. بدون كبسولات مزعجة",
        subheading: "حلوى يومية لذيذة مصممة لروتينك المزدحم. تعوضك عن قلة التعرض للشمس وتدعم نشاطك اليومي بكل سهولة.",
        eyebrow: "روتين النشاط والطاقة",
        label: "D3 + K2",
        chips: ["طاقة مستدامة", "عظام أقوى", "مناعة", "لذيذة وسهلة"],
        painTitle: "تحسين روتينك ما لازم يكون هم إضافي",
        pain: [
            "أغلبنا في السعودية يقضي وقته في المكاتب أو أماكن مغلقة بعيد عن شمس الصباح.",
            "الكبسولات الكبيرة مزعجة وتخليك توقف الروتين بعد كم يوم.",
            "الخمول المستمر والإحساس بالإرهاق بدون سبب واضح يأثر على إنجازك."
        ],
        ingredients: [
            ["فيتامين D3 (فيتامين الشمس)", "يعوض النقص الناتج عن قلة التعرض للشمس، ويدعم المناعة والطاقة اليومية."],
            ["فيتامين K2", "المرافق الأساسي لـ D3، يوجه الكالسيوم للعظام بدلاً من الشرايين."],
            ["تركيبة الحلوى الذكية", "طعم لذيذ يخليك تنتظر وقتها كل يوم، عشان تلتزم بدون ملل."]
        ],
        fdaTitle: "مصنع وفق أعلى المعايير لضمان جودتك",
        fdaText: "في ميزاني، صحتك لا تقبل المساومة. كل حلوى تُصنع وتُعبأ في منشآت معتمدة ومسجلة (FDA Registered Facility) بمعايير التصنيع الصيدلاني (GMP). كل عبوة تصلك مختومة ومفحوصة — بثقة صيدلية حقيقية.",
        scienceTitle: "الأساس العلمي لروتينك الجديد",
        scienceText: "اجتماع D3 مع K2 ليس صدفة. الدراسات توضح أن تناول D3 لوحده يزيد امتصاص الكالسيوم، لكن K2 هو من يضمن توجيه هذا الكالسيوم للعظام. جمعناها لك في تركيبة واحدة لذيذة لتوفير أقصى فائدة علمية مثبتة.",
        reviews: [
            { name: "سعد العتيبي - الرياض", text: "أخيراً لقيت فيتامين دال ما أنساه! طعمه يجنن وصرت أخليه مع قهوة الصباح. تغليفهم مرتب ووصلني للبيت بيومين.", rating: 5 },
            { name: "أمل سعد - جدة", text: "كنت أعاني من خمول عجيب، بعد ما التزمت بهالحلوى حسيت بفرق بطاقتي. والأهم إنهم تواصلوا معي واتس اب قبل الشحن.", rating: 5 },
            { name: "نورة القحطاني - الدمام", text: "مريحة جداً مقارنة بالحبوب اللي كنت أبلعها بالغصب. الدفع عند الاستلام ريحني كثير في التعامل معاهم.", rating: 5 }
        ],
        proof: "D3 و K2 من التركيبات الأكثر بحثاً علمياً. ميزاني يقدمها كحلوى صيدلانية يومية لضمان الالتزام — داعم يومي وليس بديلاً للرعاية الطبية.",
        review: "أخيراً لقيت فيتامين دال ما أنساه! طعمه يجنن وصرت أخليه مع قهوة الصباح.",
        reviewer: "سعد - الرياض"
    },
    "sleep-tea": {
        slug: "sleep-tea",
        sku: "MZN-SLP-2935",
        name: "شاي الأشواغاندا والمغنيسيوم",
        image: "assets/products/sleep-tea.webp",
        pageImages: {
            hero: "assets/product-pages/sleep-hero.webp",
            authority: "assets/product-pages/sleep-authority.webp",
            science: "assets/product-pages/sleep-science.webp"
        },
        short: "لروتين مسائي أهدأ، يساعدك على الاسترخاء بعد يوم طويل ومزدحم.",
        headline: "افصل عن ضغوط اليوم واستعد لنوم أعمق",
        subheading: "مزيج الأشواغاندا والمغنيسيوم يرسل إشارة واضحة لجسمك: انتهى وقت التوتر، وبدأ وقت الراحة.",
        eyebrow: "روتين الهدوء قبل النوم",
        label: "Sleep Tea",
        chips: ["هدوء فوري", "نوم أعمق", "مغنيسيوم", "أشواغاندا"],
        painTitle: "لما الجسم تعبان.. بس العقل يرفض ينام",
        pain: [
            "زحمة الشوارع وضغط الدوام يخلي أعصابك مشدودة حتى وقت النوم.",
            "تنسدح على السرير وتبدأ دوامة التفكير في مهام بكرا.",
            "السهر على الجوال يعطل إفراز الميلاتونين ويخرب إيقاع نومك."
        ],
        ingredients: [
            ["المغنيسيوم المهدئ", "يُعرف بمعدن الاسترخاء، يدعم ارتخاء العضلات الطبيعي والجهاز العصبي."],
            ["الأشواغاندا", "عشبة أدابتوجينيك مثبتة علمياً، تساعد الجسم على التعامل مع التوتر اليومي."],
            ["طقس الشاي الدافئ", "صناعة المشروب نفسه تعتبر 'إشارة حسية' تخبر الدماغ ببدء وقت الاسترخاء."]
        ],
        fdaTitle: "جودة تستحقها قبل النوم",
        fdaText: "لأن الهدوء يحتاج مكونات نقية، شاي ميزاني معبأ في منشآت معتمدة (FDA Registered Facility) وفق معايير GMP الصيدلانية. خالي من مهدئات كيميائية أو مواد تسبب التعود.",
        scienceTitle: "علم الاسترخاء الطبيعي",
        scienceText: "المغنيسيوم يعمل على مستوى الناقلات العصبية لتهدئة الإشارات، بينما الأشواغاندا تعمل على تنظيم مستويات الكورتيزول (هرمون التوتر). هذا الدمج المبتكر يحترم بيولوجيا جسمك ويحفز النوم بشكل طبيعي.",
        reviews: [
            { name: "فهد عبدالله - مكة", text: "صار طقسي المفضل قبل النوم. أبعد الجوال وأشرب كوب دافي.. نومي صار أعمق وأصحى مصحصح مو تعبان.", rating: 5 },
            { name: "ريم الخالدي - أبها", text: "الأشواغاندا مع المغنيسيوم سحر! كنت أعاني من تفكير وقت النوم، الحين أحس باسترخاء عجيب. شكرا ميزاني.", rating: 5 },
            { name: "مها الفهد - الرياض", text: "أجمل شيء إنه بدون مواد تسبب إدمان. خدمة العملاء عندهم بالواتساب جداً راقية والدفع عند الاستلام مريح.", rating: 5 }
        ],
        proof: "الفكرة ليست وعداً بنوم فوري سحري، بل بناء طقس مسائي ثابت بمكونات معروفة ومدروسة لدعم الاسترخاء والتقليل من حدة التوتر.",
        review: "صار طقسي المفضل قبل النوم. أبعد الجوال وأشرب كوب دافي.. نومي صار أعمق.",
        reviewer: "فهد - مكة"
    },
    "probiotic-fiber-gummies": {
        slug: "probiotic-fiber-gummies",
        sku: "MZN-PRB-6102",
        name: "حلوى البروبيوتيك والألياف",
        image: "assets/products/probiotic-fiber-gummies.webp",
        pageImages: {
            hero: "assets/product-pages/probiotic-hero.webp",
            authority: "assets/product-pages/probiotic-authority.webp",
            science: "assets/product-pages/probiotic-science.webp"
        },
        short: "لدعم صحة جهازك الهضمي وتقليل الإحساس بالانتفاخ والثقل بعد الوجبات.",
        headline: "راحة أكبر بعد كل وجبة.. بقطعة حلوى واحدة",
        subheading: "حلوى البروبيوتيك والألياف مصممة لدعم توازن بكتيريا الأمعاء، وتقليل الانزعاج اليومي بطريقة سهلة ولذيذة.",
        eyebrow: "روتين الراحة بعد الأكل",
        label: "Probiotic + Fiber",
        chips: ["هضم مريح", "توازن الأمعاء", "بدون انتفاخ", "ألياف"],
        painTitle: "الأكل المفروض يعطيك طاقة، مو ثقل",
        pain: [
            "بعد بعض الوجبات تحس بانتفاخ وثقل يخليك ودك بس تنسدح.",
            "نمط الأكل السريع وقلة الألياف في نظامنا تخرب توازن الهضم.",
            "الالتزام بخلطات الألياف أو حبوب البكتيريا المتعبة مو عملي للمدى الطويل."
        ],
        ingredients: [
            ["البروبيوتيك (البكتيريا النافعة)", "تدعم توازن فلورا الأمعاء، وتساعد في عملية الهضم بشكل طبيعي."],
            ["الألياف الحيوية", "تغذي البكتيريا النافعة وتدعم حركة الأمعاء المنتظمة بدون انزعاج."],
            ["حلوى سهلة ولذيذة", "بدون تحضير، بدون خلط.. مجرد قطعة حلوى لذيذة بعد وجبتك."]
        ],
        fdaTitle: "نقاء معتمد لمعدتك",
        fdaText: "لأن الجهاز الهضمي حساس، تُصنع هذه الحلوى في منشأة مسجلة (FDA Registered Facility) بأعلى ممارسات الجودة الصيدلانية (GMP). مكونات مختبرة بعناية لروتينك اليومي.",
        scienceTitle: "توازن بكتيريا الأمعاء هو الحل",
        scienceText: "العلم الحديث يثبت أن الأمعاء هي 'الدماغ الثاني'. إضافة البروبيوتيك مع الألياف (البريبايوتيك) يصنع بيئة تكافلية متكاملة (Synbiotic)، مما يعزز عملية الهضم ويخفف من تراكم الغازات المزعجة.",
        reviews: [
            { name: "خالد السبيعي - الرياض", text: "ارتحت بشكل كبير من الانتفاخات بعد الغداء. الحلوى طعمها لذيذ وصرت أخذها كحلى بعد الوجبة.", rating: 5 },
            { name: "لمى الدوسري - الخبر", text: "أفضل منتج هضم جربته. مريح جداً ما يحتاج تحضير. خدمة التوصيل سريعة ومندوبهم محترم.", rating: 5 },
            { name: "دانة العنزي - جدة", text: "اللي يعاني من ثقل بعد الكبسة لازم يجربه هههه! فعلاً خفف الانزعاج بشكل ملحوظ، شكراً ميزاني.", rating: 5 }
        ],
        proof: "البروبيوتيك والألياف مدعومة بآلاف الدراسات في صحة الجهاز الهضمي. ميزاني يجعلها أسهل كحلوى يومية ضمن نمط حياتك المتوازن.",
        review: "ارتحت بشكل كبير من الانتفاخات بعد الغداء. الحلوى طعمها لذيذ.",
        reviewer: "خالد - الرياض"
    }
};

const offers = [
    { qty: "قطعة واحدة", numericQty: 1, note: "للتجربة المبدئية", price: "199 ريال", numericPrice: 199 },
    { qty: "قطعتين", numericQty: 2, note: "اختيار ذكي - وفر 119 ريال", price: "279 ريال", numericPrice: 279 },
    { qty: "3 قطع", numericQty: 3, note: "الأكثر توفيرا - وفر 248 ريال (الروتين الكامل)", price: "349 ريال", numericPrice: 349 }
];

window.selectedOffers = {};

function getSelectedOffer(slug) {
    if (window.selectedOffers[slug] !== undefined) {
        return window.selectedOffers[slug];
    }
    const checked = document.querySelector('input.offer-radio[data-offer-slug="' + slug + '"]:checked');
    if (checked) {
        return Number(checked.value);
    }
    return 2; // Default to 3 pieces
}

function offerDebugLog(step, data) {
    console.log("[OFFER-DEBUG]", step, data);
}

function syncOfferRadios(slug) {
    offerDebugLog("syncOfferRadios:start", {
        slug: slug,
        selectedOffersState: window.selectedOffers[slug],
        getSelectedOffer: getSelectedOffer(slug)
    });
    document.querySelectorAll('.offers-container[data-slug="' + slug + '"]').forEach(function(container) {
        container.innerHTML = renderOffersList(slug, container.dataset.containerId || "main");
    });
    offerDebugLog("syncOfferRadios:end", {
        slug: slug,
        selectedOffersState: window.selectedOffers[slug],
        getSelectedOffer: getSelectedOffer(slug),
        checkedRadios: Array.from(document.querySelectorAll('input.offer-radio[data-offer-slug="' + slug + '"]:checked')).map(function(r) {
            return { value: r.value, name: r.name };
        })
    });
}

window.syncOfferRadios = syncOfferRadios;

function routePrefix() {
    return window.location.pathname.includes("/products/") ? "../.." : ".";
}

function getApiBase() {
    const configuredApiUrl = typeof window.MYMIZAN_API_URL === "string" ? window.MYMIZAN_API_URL.trim() : "";
    if (!configuredApiUrl && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        return "http://localhost:8000";
    }
    return (configuredApiUrl || "https://api.mymizan.shop").replace(/\/+$/, "");
}

function getAnalyticsSessionId() {
    const key = "mymizan_analytics_session";
    let sessionId = localStorage.getItem(key);
    if (!sessionId) {
        sessionId = "sess_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
        localStorage.setItem(key, sessionId);
    }
    return sessionId;
}

function currentUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].reduce((memo, key) => {
        const value = params.get(key);
        if (value) memo[key] = value;
        return memo;
    }, {});
}

function trackStorefrontEvent(eventName, properties) {
    if (window.MYMIZAN_DISABLE_ANALYTICS === true) return;

    const payload = {
        event_name: eventName,
        session_id: getAnalyticsSessionId(),
        occurred_at: new Date().toISOString(),
        path: window.location.pathname,
        url: window.location.href,
        referrer: document.referrer || "",
        user_agent: navigator.userAgent,
        product_slug: document.body.dataset.productSlug || null,
        properties: {
            ...currentUtmParams(),
            ...(properties || {})
        }
    };

    const endpoint = getApiBase() + "/events";
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon(endpoint, blob)) return;
    }

    fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true
    }).catch(() => {});
}

window.trackStorefrontEvent = trackStorefrontEvent;

function header() {
    return `
        <div class="bg-primary text-cream text-center text-xs sm:text-sm py-2.5 font-semibold flex items-center justify-center gap-4">
            <span>✓ مصانع معتمدة · GMP</span>
            <span class="hidden sm:inline">|</span>
            <span class="hidden sm:inline">✓ الدفع عند الاستلام</span>
            <span class="hidden sm:inline">|</span>
            <span class="hidden sm:inline">✓ تأكيد قبل الشحن</span>
        </div>
        <header class="bg-white/95 backdrop-blur-md border-b border-primary/10 sticky top-0 z-50 soft-shadow">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                <a href="${routePrefix()}/" class="flex items-center gap-3 group">
                    <img src="${routePrefix()}/assets/brand/mizan-mark-light.png" alt="ميزاني" class="w-12 h-12 rounded-full shadow-md group-hover:scale-105 transition-transform">
                    <div>
                        <h1 class="text-2xl font-extrabold text-primary leading-none tracking-tight">ميزاني</h1>
                        <span class="text-[10px] text-accent font-bold tracking-wide">صيدلية المكملات اليومية</span>
                    </div>
                </a>
                <nav class="hidden md:flex items-center gap-8 text-sm font-bold text-charcoal">
                    <a href="${routePrefix()}/" class="hover:text-accent transition">الرئيسية</a>
                    <a href="${routePrefix()}/#products" class="hover:text-accent transition">المنتجات</a>
                    <a href="${routePrefix()}/#why" class="hover:text-accent transition">من نحن</a>
                    <a href="${routePrefix()}/#faq" class="hover:text-accent transition">الأسئلة</a>
                </nav>
                <button data-cart-open class="bg-primary text-cream px-6 py-3 rounded-full text-sm font-extrabold hover:bg-primary/90 transition shadow-md flex items-center gap-2">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    السلة <span data-cart-count class="bg-accent text-white px-2 py-0.5 rounded-full text-xs ml-1">0</span>
                </button>
            </div>
        </header>
    `;
}

function packMockup(product) {
    const imageSrc = routePrefix() + "/" + product.image;
    return `
        <div class="relative bg-white/80 border border-white rounded-[2rem] p-4 sm:p-6 soft-shadow backdrop-blur-sm">
            <div class="aspect-[4/5] rounded-[1.7rem] overflow-hidden bg-gradient-to-br from-secondary/80 to-cream relative flex items-center justify-center group" role="img" aria-label="صورة لمنتج ${product.name}">
                <div class="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_75%_75%,rgba(20,145,155,0.3),transparent_30%)] mix-blend-overlay"></div>
                
                <img src="${imageSrc}" alt="${product.name}" class="relative z-10 w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]">

                <!-- Floating Badges -->
                <div class="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs font-extrabold text-primary shadow-lg z-20 flex items-center gap-1 border border-primary/5">
                    <span class="text-accent text-base">★</span> 4.8/5
                </div>
                
                <div class="absolute bottom-6 left-6 bg-primary text-cream px-5 py-3 rounded-2xl text-sm font-bold shadow-xl z-20 flex items-center gap-2 border border-white/10">
                    <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    معايير صيدلية
                </div>
            </div>
        </div>
    `;
}

window.selectOffer = function(slug, index) {
    index = Number(index);
    if (Number.isNaN(index) || index < 0 || index > 2) return;
    window.selectedOffers[slug] = index;
    syncOfferRadios(slug);
};

function renderOffersList(slug, containerId) {
    const activeIdx = getSelectedOffer(slug);

    return offers.map(function(offer, index) {
        const isSelected = index === activeIdx;
        const badge = index === 2
            ? '<div class="absolute -top-3 left-6 bg-accent text-white text-[11px] px-4 py-1 rounded-full font-extrabold shadow-md tracking-wide pointer-events-none z-10">🔥 الأكثر توفيراً وطلباً</div>'
            : "";
        const strikePrice = index > 0
            ? '<span class="block text-[10px] text-muted line-through mt-1">' + (index === 1 ? "398 ريال" : "597 ريال") + "</span>"
            : "";

        return (
            '<label class="offer-card flex items-center justify-between gap-4 p-5 rounded-2xl border border-primary/10 bg-gray-50/50 cursor-pointer transition-all duration-300 relative group hover:border-primary/30">' +
                '<input type="radio" class="offer-radio sr-only" name="offer-' + slug + '-' + containerId + '" value="' + index + '" data-offer-slug="' + slug + '"' + (isSelected ? ' checked' : '') + '>' +
                badge +
                '<div class="flex items-center gap-4">' +
                    '<div class="offer-radio-ring w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0">' +
                        '<div class="offer-radio-dot w-3 h-3 rounded-full bg-primary hidden"></div>' +
                    "</div>" +
                    "<div>" +
                        '<span class="block font-extrabold text-charcoal text-lg">' + offer.qty + "</span>" +
                        '<span class="offer-note block text-xs font-bold mt-1 text-muted">' + offer.note + "</span>" +
                    "</div>" +
                "</div>" +
                '<div class="text-left">' +
                    '<span class="block font-extrabold text-primary text-xl">' + offer.price + "</span>" +
                    strikePrice +
                "</div>" +
            "</label>"
        );
    }).join("");
}

window.offerSelector = function(slug) {
    const containerId = Math.random().toString(36).substring(2, 9);
    return `
        <div class="bg-white rounded-[2rem] p-6 sm:p-8 soft-shadow border border-primary/10 relative" id="offer-selector-container-${containerId}">
            <!-- Decorative accent -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div class="relative z-10">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 class="font-extrabold text-primary text-2xl">اختر الباقة المناسبة لك</h3>
                        <p class="text-sm text-muted mt-2 font-medium">الدفع عند الاستلام - الشحن مجاني للباقة الكبرى</p>
                    </div>
                    <span class="bg-warning/15 text-warning px-4 py-2 rounded-full text-xs font-extrabold border border-warning/20 flex items-center gap-1 shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        عرض اليوم محدود
                    </span>
                </div>
                
                <div class="space-y-4 offers-container" data-slug="${slug}" data-container-id="${containerId}">
                    ${renderOffersList(slug, containerId)}
                </div>
                
                <button onclick="window.handleAddProduct('${slug}')" class="w-full bg-primary text-cream font-extrabold text-xl py-5 rounded-2xl mt-8 hover:bg-primary/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group relative z-20">
                    أضف للسلة واطلب الآن
                    <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </button>
                
                <div class="flex items-center justify-center gap-4 mt-5 opacity-80">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Mada_Logo.svg/1024px-Mada_Logo.svg.png" alt="Mada" class="h-4 grayscale opacity-60">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_Pay_logo.svg/1024px-Apple_Pay_logo.svg.png" alt="Apple Pay" class="h-5 grayscale opacity-60">
                    <span class="text-xs font-bold text-muted border-r border-gray-300 pr-4">أو الدفع عند الاستلام</span>
                </div>
            </div>
        </div>
    `;
};

function footer() {
    return `
        <footer class="bg-charcoal text-cream py-16 border-t-[8px] border-primary">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-10">
                <div class="md:col-span-5">
                    <div class="flex items-center gap-3 mb-6">
                        <img src="${routePrefix()}/assets/brand/mizan-mark-light.png" alt="ميزاني" class="w-12 h-12 rounded-full shadow-sm">
                        <div>
                            <p class="font-extrabold text-xl">ميزاني</p>
                            <p class="text-[10px] text-accent tracking-wide font-bold">صيدلية المكملات اليومية</p>
                        </div>
                    </div>
                    <p class="text-base text-cream/70 leading-8 mb-6 pr-2">صيدلية مكملات يومية رقمية — حلوى فيتامينات وبروبيوتيك بتركيبات مدعومة علمياً، مصانع معتمدة (FDA/GMP)، ومكونات مُعلَنة. مكملاتك اليومية بثقة صيدلية.</p>
                    <div class="flex gap-4">
                        <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition cursor-pointer">IG</div>
                        <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition cursor-pointer">TT</div>
                        <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition cursor-pointer">SC</div>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <h4 class="font-extrabold text-lg mb-5 text-white">روابط سريعة</h4>
                    <div class="space-y-3">
                        <a class="block text-sm text-cream/70 hover:text-accent transition" href="${routePrefix()}/">الرئيسية</a>
                        <a class="block text-sm text-cream/70 hover:text-accent transition" href="${routePrefix()}/#products">كل المنتجات</a>
                        <a class="block text-sm text-cream/70 hover:text-accent transition" href="${routePrefix()}/#why">من نحن</a>
                    </div>
                </div>
                <div class="md:col-span-2">
                    <h4 class="font-extrabold text-lg mb-5 text-white">المساعدة</h4>
                    <div class="space-y-3">
                        <p class="text-sm text-cream/70 hover:text-accent transition cursor-pointer">الأسئلة الشائعة</p>
                        <p class="text-sm text-cream/70 hover:text-accent transition cursor-pointer">الشحن والتوصيل</p>
                        <p class="text-sm text-cream/70 hover:text-accent transition cursor-pointer">سياسة الاسترجاع</p>
                        <p class="text-sm text-cream/70 hover:text-accent transition cursor-pointer">تواصل معنا</p>
                    </div>
                </div>
                <div class="md:col-span-3">
                    <h4 class="font-extrabold text-lg mb-5 text-white">معايير الصيدلية</h4>
                    <div class="bg-white/5 rounded-2xl p-5 border border-white/10">
                        <div class="flex items-start gap-3 mb-3">
                            <div class="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">✓</div>
                            <p class="text-sm text-cream/90 leading-6 font-bold">تواصل مباشر لتأكيد الطلب قبل شحنه لضمان استلامك.</p>
                        </div>
                        <div class="flex items-start gap-3">
                            <div class="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0">✓</div>
                            <p class="text-sm text-cream/90 leading-6 font-bold">الدفع عند الاستلام متاح في كل مناطق المملكة.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-8 border-t border-white/10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="text-xs text-cream/50">جميع الحقوق محفوظة لميزاني © 2026 · صيدلية المكملات اليومية</p>
                <p class="text-xs text-cream/40">المنتجات مكملات غذائية — ليست أدوية طبية ولا بديلاً عن الاستشارة الطبية.</p>
            </div>
        </footer>
    `;
}

function cartDrawer() {
    return `
        <div data-cart class="fixed inset-0 z-[100] hidden">
            <div data-cart-close class="absolute inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"></div>
            <aside class="absolute left-0 top-0 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col transform transition-transform">
                <div class="p-6 border-b border-primary/10 flex items-center justify-between bg-white">
                    <h3 class="text-2xl font-extrabold text-primary flex items-center gap-2">
                        سلتك
                        <span data-cart-count-badge class="bg-accent text-white text-sm px-2 py-0.5 rounded-full">0</span>
                    </h3>
                    <button data-cart-close class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-muted hover:bg-gray-200 transition">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div data-cart-items class="p-6 flex-1 overflow-y-auto space-y-4 bg-cream"></div>
                
                <div class="p-6 bg-white border-t border-primary/10 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
                    <div class="flex justify-between items-center mb-4">
                        <span class="font-bold text-muted">المجموع المبدئي</span>
                        <span class="font-extrabold text-xl text-primary" data-cart-total>0 ريال</span>
                    </div>
                    
                    <div class="mb-6 bg-success/10 rounded-xl p-3 border border-success/20 flex gap-3 items-start">
                        <svg class="w-5 h-5 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        <p class="text-xs text-success-dark font-bold leading-5">أنت مؤهل للشحن المجاني والدفع عند الاستلام. نؤكد طلبك قبل الإرسال.</p>
                    </div>
                    
                    <button data-checkout-open class="w-full bg-primary text-cream font-extrabold text-lg py-5 rounded-2xl hover:bg-primary/90 transition shadow-xl">
                        إتمام الطلب بأمان
                    </button>
                    <div class="flex justify-center items-center gap-2 mt-4 text-xs font-bold text-muted">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        تسوق آمن وموثق
                    </div>
                </div>
            </aside>
        </div>

        <div data-checkout class="fixed inset-0 z-[110] hidden items-center justify-center p-4 sm:p-6">
            <div data-checkout-close class="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"></div>
            <form id="checkout-form" novalidate class="relative bg-white rounded-[2.5rem] overflow-hidden w-full max-w-xl soft-shadow flex flex-col max-h-[90vh]">
                <div class="bg-primary p-6 text-center relative">
                    <button type="button" data-checkout-close class="absolute left-4 top-4 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition">✕</button>
                    <h3 class="text-2xl font-extrabold text-white mb-1">خطوة أخيرة لتأكيد طلبك</h3>
                    <p class="text-sm text-cream/80 font-medium">لن تدفع شيئاً الآن - الدفع عند الاستلام</p>
                </div>
                
                <div class="p-6 sm:p-8 overflow-y-auto">
                    <div id="checkout-error" class="hidden bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 text-sm font-bold text-center"></div>

                    <div class="bg-cream rounded-2xl p-4 mb-6 border border-primary/10 flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <div>
                            <p class="font-extrabold text-primary text-sm" id="checkout-item-name">جاري التجهيز...</p>
                            <p class="text-xs text-muted mt-1 font-bold" id="checkout-item-detail">باقة 3 قطع - الدفع عند الاستلام</p>
                        </div>
                    </div>

                    <div class="space-y-5">
                        <div>
                            <label class="block text-sm font-extrabold text-charcoal mb-2">الاسم الكامل <span class="text-red-500">*</span></label>
                            <input id="checkout-name" name="customer_name" class="w-full border-2 border-gray-200 focus:border-primary rounded-2xl px-5 py-4 outline-none transition bg-gray-50 focus:bg-white text-charcoal font-bold" placeholder="مثال: محمد أحمد">
                        </div>
                        <div>
                            <label class="block text-sm font-extrabold text-charcoal mb-2">رقم الجوال (للتأكيد قبل الشحن) <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold" dir="ltr">+966</span>
                                <input id="checkout-phone" name="customer_phone" type="tel" class="w-full border-2 border-gray-200 focus:border-primary rounded-2xl px-5 py-4 pl-16 outline-none transition bg-gray-50 focus:bg-white text-charcoal font-bold" placeholder="5XXXXXXXX" dir="ltr">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-6 sm:p-8 bg-gray-50 border-t border-gray-100">
                    <button type="submit" id="checkout-submit-btn" class="w-full bg-primary text-cream font-extrabold text-xl py-5 rounded-2xl hover:bg-primary/90 transition shadow-xl flex items-center justify-center gap-3">
                        تأكيد الطلب 
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </button>
                    <p class="text-xs font-bold text-muted text-center mt-4">بضغطك على تأكيد الطلب، سيقوم فريقنا بالتواصل معك لتحديد موعد ومكان التوصيل المناسب لك.</p>
                </div>
            </form>
        </div>
    `;
}

function initStorefront() {
    const root = document.querySelector("[data-site-shell]");
    if (root) {
        root.insertAdjacentHTML("afterbegin", header());
        root.insertAdjacentHTML("beforeend", footer() + cartDrawer());
    }

    let cart = [];
    const cartEl = document.querySelector("[data-cart]");
    const checkoutEl = document.querySelector("[data-checkout]");
    const countEls = document.querySelectorAll("[data-cart-count], [data-cart-count-badge]");
    const itemsEl = document.querySelector("[data-cart-items]");
    const totalEl = document.querySelector("[data-cart-total]");

    // Global function to remove cart items
    window.removeItemFromCart = function(idx) {
        cart.splice(idx, 1);
        renderCart();
    };

    function renderCart() {
        countEls.forEach(el => el.textContent = String(cart.length));
        if (!itemsEl) return;
        
        let total = cart.reduce((sum, item) => sum + (item.offer ? item.offer.numericPrice : 0), 0);
        if (totalEl) totalEl.textContent = total + ' ريال';

        itemsEl.innerHTML = cart.length
            ? cart.map((item, idx) => `
                <div class="bg-white rounded-2xl p-4 border border-primary/10 shadow-sm flex gap-4 relative animate-fade-in" style="animation-delay: ${idx * 0.05}s">
                    <div class="w-20 h-20 rounded-xl bg-secondary overflow-hidden shrink-0 border border-primary/5">
                        <img src="${routePrefix()}/${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1">
                        <p class="font-extrabold text-primary text-sm leading-tight mb-1">${item.name}</p>
                        <p class="text-xs text-accent font-bold mb-2">${item.offer ? 'باقة ' + item.offer.qty + ' - ' + item.offer.note : ''}</p>
                        <div class="flex justify-between items-center">
                            <span class="font-extrabold text-charcoal">${item.offer ? item.offer.price : ''}</span>
                            <button type="button" class="text-xs text-red-400 font-bold hover:text-red-600 underline" onclick="window.removeItemFromCart(${idx}); event.stopPropagation();">حذف</button>
                        </div>
                    </div>
                </div>
            `).join("")
            : `
                <div class="text-center py-10">
                    <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                    </div>
                    <p class="font-extrabold text-primary mb-2">سلتك فارغة حالياً</p>
                    <p class="text-sm text-muted">اكتشف منتجاتنا واختر الروتين اللي يناسبك.</p>
                </div>
            `;
            
        // Update checkout item name
        const checkoutItemName = document.getElementById('checkout-item-name');
        const checkoutItemDetail = document.getElementById('checkout-item-detail');
        if (checkoutItemName && cart.length > 0) {
            const lastItem = cart[cart.length - 1];
            checkoutItemName.textContent = lastItem.name;
            if (checkoutItemDetail && lastItem.offer) {
                checkoutItemDetail.textContent = 'باقة ' + lastItem.offer.qty + ' - الدفع عند الاستلام';
            }
        }
    }

    window.handleAddProduct = function(slug) {
        const product = products[slug];
        if (product) {
            const selectedOffer = offers[getSelectedOffer(slug)];
            cart.push({
                ...product,
                offer: selectedOffer
            });
            trackStorefrontEvent("add_to_cart", {
                product_slug: slug,
                sku: product.sku,
                offer_quantity: selectedOffer ? selectedOffer.numericQty : 1,
                offer_price: selectedOffer ? selectedOffer.numericPrice : null,
                cart_size: cart.length
            });
            renderCart();
            const cartEl = document.querySelector("[data-cart]");
            if (cartEl) cartEl.classList.remove("hidden");
        }
    };

    document.body.addEventListener("click", (event) => {
        const trackedLink = event.target.closest("a[href], button");
        if (trackedLink) {
            trackStorefrontEvent("click", {
                label: (trackedLink.textContent || "").trim().slice(0, 120),
                href: trackedLink.getAttribute("href") || "",
                action: trackedLink.dataset.addProduct ? "add_product" : trackedLink.dataset.checkoutOpen !== undefined ? "checkout_open" : "navigation"
            });
        }

        const addProductBtn = event.target.closest("[data-add-product]");
        if (addProductBtn) {
            window.handleAddProduct(addProductBtn.dataset.addProduct);
            return;
        }

        if (event.target.closest("[data-cart-open]")) {
            trackStorefrontEvent("cart_open", { cart_size: cart.length });
            cartEl?.classList.remove("hidden");
        }
        if (event.target.closest("[data-cart-close]")) {
            cartEl?.classList.add("hidden");
        }
        if (event.target.closest("[data-checkout-open]")) {
            if (cart.length === 0) return alert("السلة فارغة");
            trackStorefrontEvent("checkout_open", {
                cart_size: cart.length,
                total: cart.reduce((sum, item) => sum + (item.offer ? item.offer.numericPrice : 0), 0)
            });
            cartEl?.classList.add("hidden");
            checkoutEl?.classList.remove("hidden");
            checkoutEl?.classList.add("flex");
        }
        if (event.target.closest("[data-checkout-close]")) {
            checkoutEl?.classList.add("hidden");
            checkoutEl?.classList.remove("flex");
        }
    });

    renderCart();

    const configuredApiUrl = typeof window.MYMIZAN_API_URL === "string" ? window.MYMIZAN_API_URL.trim() : "";
    const API_BASE = getApiBase();

    const checkoutForm = document.getElementById("checkout-form");
    console.log("[ORDER-DEBUG] step-1 checkout form lookup", { found: !!checkoutForm });
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            console.log("[ORDER-DEBUG] step-2 submit event fired");

            const errorEl = document.getElementById("checkout-error");
            const submitBtn = document.getElementById("checkout-submit-btn");
            const nameInput = document.getElementById("checkout-name");
            const phoneInput = document.getElementById("checkout-phone");

            errorEl.classList.add("hidden");
            errorEl.textContent = "";

            const customerName = nameInput.value.trim();
            const phoneRaw = phoneInput.value.trim().replace(/\s+/g, "");
            console.log("[ORDER-DEBUG] step-3 raw form values read", {
                hasName: !!customerName,
                phoneRaw: phoneRaw,
                cartItems: cart.length
            });

            if (!customerName || customerName.length < 2) {
                errorEl.textContent = "الرجاء إدخال الاسم الكامل";
                errorEl.classList.remove("hidden");
                console.log("[ORDER-DEBUG] stop-1 validation failed: name");
                return;
            }
            let phoneClean = phoneRaw.replace(/[^0-9]/g, "");
            if (phoneClean.startsWith("966")) phoneClean = phoneClean.slice(3);
            if (phoneClean.startsWith("0")) phoneClean = phoneClean.slice(1);
            if (phoneClean.length !== 9 || !phoneClean.startsWith("5")) {
                errorEl.textContent = "الرجاء إدخال رقم جوال صحيح يبدأ بـ 5 (مثال: 5XXXXXXXX)";
                errorEl.classList.remove("hidden");
                console.log("[ORDER-DEBUG] stop-2 validation failed: phone", { phoneClean: phoneClean });
                return;
            }

            if (cart.length === 0) {
                errorEl.textContent = "السلة فارغة";
                errorEl.classList.remove("hidden");
                console.log("[ORDER-DEBUG] stop-3 validation failed: empty cart");
                return;
            }

            console.log("[ORDER-DEBUG] step-4 validation passed");

            const phone = "05" + phoneClean.slice(1);
            const totalSar = cart.reduce((sum, item) => sum + (item.offer ? item.offer.numericPrice : 0), 0);
            
            // Fixed payload to match Backend OrderCreateIn schema
            const items = cart.map(item => ({
                product_slug: item.slug,
                quantity: item.offer ? item.offer.numericQty : 1
            }));

            const orderPayload = {
                customer_name: customerName,
                phone: phone,
                city: "غير محدد", // Required by backend schema
                items: items,
                subtotal: totalSar,
                total: totalSar
            };

            console.log("[ORDER-DEBUG] step-5 payload built", orderPayload);
            trackStorefrontEvent("order_submit_attempt", {
                cart_size: cart.length,
                items,
                total: totalSar
            });

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> جاري تأكيد الطلب...';

            function generateOrderNumber() {
                const now = new Date();
                const date = now.getFullYear().toString() +
                    String(now.getMonth() + 1).padStart(2, "0") +
                    String(now.getDate()).padStart(2, "0");
                const seq = String(Math.floor(Math.random() * 9000) + 1000);
                return "mizan" + date + seq;
            }

            function redirectToThankYou(orderNumber) {
                const orderData = {
                    order_number: orderNumber,
                    customer_name: customerName,
                    phone: "+966" + phoneClean,
                    items: cart.map(item => ({ 
                        name: item.name, 
                        slug: item.slug, 
                        qty: item.offer ? item.offer.numericQty : 1, 
                        price: item.offer ? item.offer.numericPrice : 0 
                    })),
                    total_sar: totalSar,
                    created_at: new Date().toISOString()
                };
                sessionStorage.setItem("mymizan_order", JSON.stringify(orderData));
                cart = [];
                renderCart();
                window.location.href = "/thank-you?order=" + encodeURIComponent(orderNumber);
            }

            let orderNumber = generateOrderNumber();

            // Use the correct backend URL if testing locally
            const endpoint = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !configuredApiUrl
                ? "http://localhost:8000/orders" 
                : API_BASE + "/orders";
            console.log("[ORDER-DEBUG] step-6 fetch about to start", { endpoint: endpoint });

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderPayload)
                });
                
                console.log("[ORDER-DEBUG] step-7 fetch response received", { status: response.status, ok: response.ok });

                if (response.ok) {
                    const data = await response.json();
                    console.log("[ORDER-DEBUG] step-8 response json parsed", data);
                    if (data.success && data.order_number) {
                        orderNumber = data.order_number;
                    }
                    trackStorefrontEvent("order_created", {
                        order_number: orderNumber,
                        total: totalSar,
                        items
                    });
                } else {
                    const errText = await response.text();
                    console.error("[ORDER-DEBUG] stop-4 backend returned non-OK", { status: response.status, body: errText });
                    trackStorefrontEvent("order_submit_failed", {
                        status: response.status,
                        total: totalSar
                    });
                    errorEl.textContent = "حدث خطأ أثناء تأكيد الطلب (الرمز " + response.status + "). يرجى المحاولة مرة أخرى.";
                    errorEl.classList.remove("hidden");
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'تأكيد الطلب <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                    return; // Prevent redirect to see error
                }
            } catch (e) {
                console.error("[ORDER-DEBUG] stop-5 fetch threw before response", e);
                trackStorefrontEvent("order_submit_failed", {
                    reason: "network",
                    total: totalSar
                });
                errorEl.textContent = "خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت وتأكد أن السيرفر يعمل.";
                errorEl.classList.remove("hidden");
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'تأكيد الطلب <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                return; // Prevent redirect to see error
            }

            console.log("[ORDER-DEBUG] step-9 redirecting after successful order", { orderNumber: orderNumber });
            redirectToThankYou(orderNumber);
        });
    }
}

document.addEventListener("click", function(event) {
    const label = event.target.closest("label.offer-card");
    if (!label) return;
    const radio = label.querySelector('input.offer-radio[type="radio"]');
    offerDebugLog("click:offer-card", {
        clickedOfferValue: radio ? radio.value : null,
        clickedOfferPrice: label.querySelector(".text-primary.text-xl") ? label.querySelector(".text-primary.text-xl").textContent.trim() : null,
        selectedOfferBeforeClick: radio && radio.dataset.offerSlug ? getSelectedOffer(radio.dataset.offerSlug) : null,
        radioCheckedBeforeClick: radio ? radio.checked : null,
        targetTag: event.target.tagName,
        slug: radio ? radio.dataset.offerSlug : null
    });
}, true);

document.addEventListener("change", function(event) {
    const radio = event.target;
    offerDebugLog("change:event-received", {
        targetTag: radio ? radio.tagName : null,
        targetType: radio ? radio.type : null,
        targetClass: radio && radio.className ? radio.className : null,
        matchesOfferRadio: !!(radio && radio.matches && radio.matches('input.offer-radio[type="radio"]'))
    });
    if (!radio || !radio.matches || !radio.matches('input.offer-radio[type="radio"]')) return;
    const slug = radio.dataset.offerSlug;
    const index = Number(radio.value);
    const before = getSelectedOffer(slug);
    offerDebugLog("change:offer-radio", {
        clickedOfferValue: radio.value,
        selectedOfferBeforeClick: before,
        slug: slug
    });
    if (!slug || Number.isNaN(index)) {
        offerDebugLog("change:aborted", { reason: "missing slug or invalid index", slug: slug, index: index });
        return;
    }
    window.selectedOffers[slug] = index;
    offerDebugLog("change:state-updated", {
        clickedOfferValue: radio.value,
        selectedOfferAfterClick: window.selectedOffers[slug]
    });
    syncOfferRadios(slug);
    offerDebugLog("change:complete", {
        clickedOfferValue: radio.value,
        selectedOfferAfterClick: getSelectedOffer(slug),
        activeLabels: Array.from(document.querySelectorAll('label.offer-card')).filter(function(label) {
            return !!label.querySelector('input.offer-radio:checked');
        }).map(function(label) {
            return label.querySelector(".text-primary.text-xl") ? label.querySelector(".text-primary.text-xl").textContent.trim() : null;
        })
    });
});

document.addEventListener("DOMContentLoaded", function() {
    offerDebugLog("storefront:DOMContentLoaded", {
        storefrontJsLoaded: true,
        hasChangeListener: true,
        hasSyncOfferRadios: typeof window.syncOfferRadios === "function"
    });
    initStorefront();
    trackStorefrontEvent("page_view", {
        title: document.title,
        product_slug: document.body.dataset.productSlug || null
    });
    if (document.body.dataset.productSlug) {
        trackStorefrontEvent("product_view", {
            product_slug: document.body.dataset.productSlug
        });
    }
});

offerDebugLog("storefront:script-parsed", { line: "storefront.js executed successfully" });