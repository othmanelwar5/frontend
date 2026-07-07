function renderProductPage(slug) {
    const product = products[slug];
    if (!product) return;

    document.title = `ميزاني | ${product.name}`;
    const main = document.querySelector("[data-product-page]");

    const productPageImage = (src, alt, aspectClass) => `
        <div class="${aspectClass} rounded-[2rem] overflow-hidden bg-white border border-primary/10 soft-shadow">
            <img
                src="${routePrefix()}/${src}"
                alt="${alt}"
                class="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
            >
        </div>
    `;

    const productGallery = (product) => {
        const images = [
            [product.pageImages.hero, product.name],
            [product.pageImages.authority, `${product.name} بمعايير صيدلية`],
            [product.pageImages.science, `مكونات ${product.name}`]
        ];

        return `
            <div class="grid grid-cols-3 gap-3 mt-4">
                ${images.map(([src, alt]) => `
                    <div class="aspect-square rounded-2xl overflow-hidden bg-white border border-primary/10 shadow-sm">
                        <img
                            src="${routePrefix()}/${src}"
                            alt="${alt}"
                            class="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                        >
                    </div>
                `).join("")}
            </div>
        `;
    };

    main.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-pattern overflow-hidden relative">
            <div class="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 relative z-10">
                <div class="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    <div class="lg:col-span-7 order-2 lg:order-1">
                        <div class="flex flex-wrap items-center gap-2 mb-6">
                            <span class="bg-white text-primary border border-primary/10 px-4 py-2 rounded-full text-xs font-extrabold shadow-sm flex items-center gap-1">
                                <span class="text-accent text-base">★</span> 4.8/5 (940+ تقييم)
                            </span>
                            <span class="bg-primary text-cream px-4 py-2 rounded-full text-xs font-extrabold shadow-sm">الدفع عند الاستلام</span>
                        </div>
                        
                        <span class="text-accent text-sm font-extrabold tracking-wide mb-3 block inline-block bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">${product.eyebrow}</span>
                        
                        <h2 id="product-headline" class="text-4xl lg:text-6xl font-extrabold text-primary mb-6 leading-[1.2] drop-shadow-sm scroll-mt-28">${product.headline}</h2>
                        
                        <p class="text-lg lg:text-xl text-charcoal leading-9 mb-8 font-medium">${product.subheading}</p>
                        
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                            ${product.chips.slice(0, 4).map((chip) => `
                                <div class="bg-white/80 backdrop-blur-sm border border-primary/10 rounded-2xl p-4 text-center soft-shadow hover:-translate-y-1 transition-transform">
                                    <div class="w-8 h-8 mx-auto bg-primary/5 rounded-full flex items-center justify-center text-primary mb-2">✓</div>
                                    <p class="text-sm font-extrabold text-primary">${chip}</p>
                                </div>
                            `).join("")}
                        </div>
                        
                        ${offerSelector(slug)}
                        
                        <!-- Trust Badges Under CTA -->
                        <div class="mt-6 grid grid-cols-3 gap-2 text-center border-t border-primary/10 pt-6">
                            <div>
                                <div class="w-10 h-10 mx-auto bg-success/10 text-success rounded-full flex items-center justify-center mb-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <p class="text-xs font-bold text-charcoal">الدفع عند الاستلام</p>
                            </div>
                            <div>
                                <div class="w-10 h-10 mx-auto bg-success/10 text-success rounded-full flex items-center justify-center mb-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                </div>
                                <p class="text-xs font-bold text-charcoal">شحن سريع للسعودية</p>
                            </div>
                            <div>
                                <div class="w-10 h-10 mx-auto bg-warning/10 text-warning rounded-full flex items-center justify-center mb-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                <p class="text-xs font-bold text-charcoal">ضمان ذهبي 30 يوم</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lg:col-span-5 order-1 lg:order-2">
                        ${productPageImage(product.pageImages.hero, product.name, "aspect-[4/5]")}
                        ${productGallery(product)}
                    </div>
                </div>
            </div>
        </section>

        <!-- Pain vs Solution Section (Emotional) -->
        <section class="py-20 lg:py-28 bg-cream">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="text-center max-w-3xl mx-auto mb-16">
                    <span class="text-accent font-extrabold text-sm tracking-wider uppercase mb-2 block">هل هذا أنت؟</span>
                    <h2 class="text-3xl lg:text-5xl font-extrabold text-primary mb-6 leading-[1.3]">${product.painTitle}</h2>
                    <p class="text-lg text-charcoal leading-9 font-medium">${product.short}</p>
                </div>
                
                <div class="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    ${product.painPoints.map((point) => `
                        <div class="bg-white rounded-[2.5rem] p-8 soft-shadow border border-primary/5 flex flex-col h-full">
                            <div class="mb-6 flex-1">
                                <div class="flex items-center gap-3 mb-3">
                                    <div class="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </div>
                                    <h4 class="font-extrabold text-red-500 text-sm">المشكلة</h4>
                                </div>
                                <p class="text-charcoal leading-8 font-medium">${point.problem}</p>
                            </div>
                            <div class="pt-6 border-t border-gray-100 flex-1">
                                <div class="flex items-center gap-3 mb-3">
                                    <div class="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                    <h4 class="font-extrabold text-success text-sm">الحل مع ميزاني</h4>
                                </div>
                                <p class="text-primary font-bold leading-8">${point.solution}</p>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>

        <!-- Clinical Formula (Ingredients + Science) -->
        <section id="ingredients" class="py-20 lg:py-28 bg-white border-y border-gray-100 overflow-hidden relative">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div class="text-center max-w-3xl mx-auto mb-16">
                    <span class="text-accent font-extrabold text-sm tracking-wider block mb-2">تركيبة صيدلانية</span>
                    <h2 class="text-3xl lg:text-5xl font-extrabold text-primary mb-6">ليش تثق في تركيبة ميزاني؟</h2>
                    <p class="text-lg text-muted leading-8">مكونات مُعلَنة، جرعات مدروسة، وتعبئة بمعايير GMP — لأن الالتزام اليومي يبدأ من الثقة.</p>
                </div>
                
                <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div class="order-2 lg:order-1">
                        <div class="space-y-8">
                            ${product.ingredients.map(([title, text], idx) => `
                                <div class="flex gap-6">
                                    <div class="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center font-extrabold text-xl shrink-0 border border-primary/10">
                                        0${idx + 1}
                                    </div>
                                    <div>
                                        <h3 class="text-2xl font-extrabold text-primary mb-3">${title}</h3>
                                        <p class="text-charcoal leading-8 font-medium">${text}</p>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                        
                        <div class="mt-12 p-6 bg-secondary/30 rounded-2xl border border-primary/10">
                            <h4 class="font-extrabold text-primary mb-4">مدعوم بالدليل:</h4>
                            <p class="text-charcoal leading-8 mb-4">${product.scienceText}</p>
                            <p class="text-sm text-muted italic">"${product.proof}"</p>
                        </div>
                    </div>
                    
                    <div class="order-1 lg:order-2 relative">
                        <div class="absolute inset-0 bg-primary/5 rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
                        ${productPageImage(product.pageImages.science, `مكونات ${product.name}`, "aspect-[4/5] lg:aspect-square")}
                        
                        <!-- Trust Tags overlay -->
                        <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] flex flex-wrap justify-center gap-2">
                            ${product.trustTags.map(tag => `
                                <span class="bg-white text-primary px-4 py-2 rounded-full text-xs font-extrabold shadow-lg border border-primary/10 whitespace-nowrap">
                                    ✓ ${tag}
                                </span>
                            `).join("")}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Authority & FDA Section -->
        <section class="py-20 lg:py-28 bg-primary relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(20,145,155,0.3),transparent_60%)]"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div class="order-2 lg:order-1 relative">
                        ${productPageImage(product.pageImages.authority, `${product.name} بمعايير صيدلية`, "aspect-[4/3]")}
                    </div>
                    <div class="order-1 lg:order-2 text-cream">
                        <span class="text-accent font-extrabold text-sm tracking-wider uppercase mb-2 block">معايير صيدلية</span>
                        <h2 class="text-3xl lg:text-4xl font-extrabold mb-6 leading-tight">${product.fdaTitle}</h2>
                        <p class="text-lg text-cream/90 leading-9 mb-8">${product.fdaText}</p>
                        
                        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
                            <h4 class="font-extrabold text-accent mb-2">توقعات واقعية:</h4>
                            <p class="text-sm leading-7">يبدأ المفعول من الأسبوع الأول، والنتيجة الحقيقية تظهر مع الالتزام. المكملات الغذائية تحتاج وقت لبناء مخزون الجسم بشكل طبيعي وآمن.</p>
                        </div>
                        
                        <div class="flex flex-wrap gap-4">
                            <div class="bg-white/5 border border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
                                <div class="w-3 h-3 bg-success rounded-full"></div>
                                <span class="font-bold text-sm">ممارسات تصنيع جيدة (GMP)</span>
                            </div>
                            <div class="bg-white/5 border border-white/20 rounded-xl px-5 py-3 flex items-center gap-3">
                                <div class="w-3 h-3 bg-success rounded-full"></div>
                                <span class="font-bold text-sm">منشأة مسجلة عالمياً</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Social Proof / Reviews Section -->
        <section id="reviews" class="py-20 lg:py-28 bg-cream">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="text-center mb-16">
                    <h2 class="text-3xl lg:text-5xl font-extrabold text-primary mb-6">ماذا يقول عملاؤنا؟</h2>
                    <div class="flex items-center justify-center gap-2 text-accent text-xl">
                        ★★★★★
                        <span class="text-charcoal font-bold text-sm ml-2">4.8/5 متوسط التقييمات</span>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6">
                    ${product.reviews.map((rev) => `
                        <div class="bg-white rounded-[2rem] p-8 border border-primary/5 soft-shadow flex flex-col">
                            <div class="flex items-center justify-between mb-6">
                                <div class="flex items-center gap-1 text-accent">
                                    ${Array(rev.rating).fill('★').join('')}
                                </div>
                                <span class="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    مشتري مؤكد
                                </span>
                            </div>
                            <p class="text-lg text-charcoal leading-9 mb-6 font-medium flex-1">"${rev.text}"</p>
                            <div class="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
                                <div class="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-extrabold text-lg">
                                    ${rev.name.split(' ')[0][0]}
                                </div>
                                <div>
                                    <p class="font-extrabold text-primary">${rev.name}</p>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
                
                <div class="mt-12 text-center">
                    <div class="inline-block px-8 py-4 bg-white rounded-2xl border border-primary/10 soft-shadow">
                        <p class="text-primary font-bold">عشرات التقييمات الإيجابية يومياً.. التجربة خير برهان.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Final CTA Section -->
        <section class="py-20 lg:py-28 bg-white relative overflow-hidden border-t border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div class="text-center lg:text-right">
                    <span class="text-accent font-extrabold tracking-widest text-sm uppercase mb-4 block">اطلب بثقة صيدلية</span>
                    <h2 class="text-4xl lg:text-6xl font-extrabold text-primary mb-6 leading-tight">ابدأ روتينك اليومي</h2>
                    <p class="text-lg text-charcoal leading-9 mb-8 max-w-xl mx-auto lg:mx-0 font-medium">
                        حلوى مكملات مدروسة — اختر الباقة، اكتب معلوماتك، وفريقنا يتصل بك للتأكيد. الدفع عند الاستلام فقط.
                    </p>
                    <ul class="text-right space-y-4 text-charcoal font-bold max-w-md mx-auto lg:mx-0 hidden lg:block">
                        <li class="flex items-center gap-3"><span class="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-sm shrink-0">✓</span> ضمان 30 يوم</li>
                        <li class="flex items-center gap-3"><span class="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-sm shrink-0">✓</span> شحن مجاني للباقة الكبرى</li>
                        <li class="flex items-center gap-3"><span class="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center text-sm shrink-0">✓</span> دعم عبر الواتساب متواصل</li>
                    </ul>
                </div>
                <div>
                    ${offerSelector(slug)}
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="py-20 lg:py-28 bg-cream">
            <div class="max-w-3xl mx-auto px-4 sm:px-6">
                <div class="text-center mb-12">
                    <h2 class="text-3xl lg:text-5xl font-extrabold text-primary mb-4">أسئلة تهمك قبل الطلب</h2>
                    <p class="text-muted">إجابات واضحة — بروح الصيدلية</p>
                </div>
                <div class="space-y-4">
                    <div class="bg-white rounded-2xl p-6 border border-primary/10 shadow-sm">
                        <strong class="text-primary text-lg block mb-2">كيف أستخدم المنتج؟</strong>
                        <p class="text-muted leading-8 font-medium">اتبع طريقة الاستخدام المكتوبة على العبوة. السر دائماً في الاستمرار وجعله جزءاً من روتينك (مثلا مع القهوة أو قبل النوم).</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6 border border-primary/10 shadow-sm">
                        <strong class="text-primary text-lg block mb-2">متى يوصلني الطلب؟</strong>
                        <p class="text-muted leading-8 font-medium">بعد تأكيد الطلب، يستغرق التوصيل عادة 1-2 أيام عمل للمدن الرئيسية، و2-5 أيام عمل لباقي المناطق في السعودية. فريقنا سيحدثك برقم التتبع.</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6 border border-primary/10 shadow-sm">
                        <strong class="text-primary text-lg block mb-2">هل هذا بديل لأدويتي؟</strong>
                        <p class="text-muted leading-8 font-medium">قطعاً لا. منتجات ميزاني مكملات غذائية لدعم الصحة العامة — ليست أدوية طبية. استشر طبيبك عند الحاجة.</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6 border border-primary/10 shadow-sm">
                        <strong class="text-primary text-lg block mb-2">إذا ما ناسبني المنتج؟</strong>
                        <p class="text-muted leading-8 font-medium">نقدم ضمان ذهبي لتجربة المنتج. يمكنك التواصل معنا عبر الواتساب في حال وجود أي مشكلة وسنقوم بخدمتك لضمان رضاك التام.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Smart Sticky CTA -->
        <div id="sticky-cta" class="fixed inset-x-0 bg-white/95 backdrop-blur-md border-primary/10 px-4 py-3 z-50 shadow-[0_0_20px_rgba(0,0,0,0.1)] transition-transform duration-300 translate-y-full lg:-translate-y-full bottom-0 lg:bottom-auto lg:top-0 border-t lg:border-t-0 lg:border-b flex items-center justify-between gap-4">
            <div class="hidden lg:flex items-center gap-4">
                <img src="${routePrefix()}/${product.image}" alt="${product.name}" class="w-12 h-12 rounded-xl object-cover border border-primary/10">
                <div>
                    <h3 class="font-extrabold text-primary text-sm">${product.name}</h3>
                    <div class="flex items-center gap-1 text-accent text-xs">
                        ★★★★★ <span class="text-muted ml-1">(940+)</span>
                    </div>
                </div>
            </div>
            <div class="flex-1 lg:flex-none">
                <button onclick="document.getElementById('product-headline').scrollIntoView({behavior: 'smooth'})" class="w-full lg:w-auto bg-primary text-cream font-extrabold text-lg lg:text-base px-8 py-4 lg:py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition">
                    اطلب الآن - الدفع عند الاستلام
                </button>
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const slug = document.body.dataset.productSlug;
    console.log("[OFFER-DEBUG] product-page:DOMContentLoaded", {
        slug: slug,
        offerCardCountBeforeRender: document.querySelectorAll("label.offer-card").length
    });
    renderProductPage(slug);
    console.log("[OFFER-DEBUG] product-page:after-render", {
        slug: slug,
        offerCardCount: document.querySelectorAll("label.offer-card").length,
        offerRadioCount: document.querySelectorAll("input.offer-radio").length,
        checkedRadios: Array.from(document.querySelectorAll("input.offer-radio:checked")).map((r) => ({
            value: r.value,
            name: r.name,
            slug: r.dataset.offerSlug
        }))
    });
    if (slug && window.syncOfferRadios) {
        window.syncOfferRadios(slug);
    }
    console.log("[OFFER-DEBUG] product-page:after-sync", {
        slug: slug,
        selectedOffer: window.getSelectedOffer ? window.getSelectedOffer(slug) : "getSelectedOffer not exposed",
        selectedOffersState: window.selectedOffers ? window.selectedOffers[slug] : undefined
    });

    // Add scroll listener for Sticky CTA
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            // Show after scrolling past 500px
            if (window.scrollY > 500) {
                stickyCta.classList.remove('translate-y-full', 'lg:-translate-y-full');
            } else {
                stickyCta.classList.add('translate-y-full', 'lg:-translate-y-full');
            }
        });
    }
});