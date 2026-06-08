function renderProductPage(slug) {
    const product = products[slug];
    if (!product) return;

    document.title = `ميزاني | ${product.name}`;
    const main = document.querySelector("[data-product-page]");
    
    // Placeholder logic for empty images as requested: "you can have images ampy"
    const imagePlaceholder = (text) => `
        <div class="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center text-gray-500 font-bold text-center p-6">
            <div class="space-y-3">
                <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p>${text}</p>
            </div>
        </div>
    `;

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
                        
                        <h2 class="text-4xl lg:text-6xl font-extrabold text-primary mb-6 leading-[1.2] drop-shadow-sm">${product.headline}</h2>
                        
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
                    </div>
                    
                    <div class="lg:col-span-5 order-1 lg:order-2">
                        ${packMockup(product)}
                    </div>
                </div>
            </div>
        </section>

        <!-- Trust Bar -->
        <section class="bg-primary text-cream border-t border-white/20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm font-bold text-center">
                <div class="flex flex-col items-center gap-2">
                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    الدفع عند الاستلام
                </div>
                <div class="flex flex-col items-center gap-2">
                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    توصيل سريع وموثوق
                </div>
                <div class="flex flex-col items-center gap-2">
                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    ضمان جودة 30 يوم
                </div>
                <div class="flex flex-col items-center gap-2">
                    <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    تأكيد هاتفي للطلب
                </div>
            </div>
        </section>

        <!-- Pain Section (Emotional) -->
        <section class="py-20 lg:py-28 bg-cream">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                <div class="lg:col-span-5">
                    <span class="text-accent font-extrabold text-sm tracking-wider uppercase mb-2 block">هل هذا أنت؟</span>
                    <h2 class="text-3xl lg:text-5xl font-extrabold text-primary mb-6 leading-[1.3]">${product.painTitle}</h2>
                    <p class="text-lg text-charcoal leading-9 mb-6 font-medium">${product.short}</p>
                    <p class="text-lg text-muted leading-9">روتين الحياة السريع يحتاج حلول عملية، مو وعود معقدة ما تقدر تلتزم فيها.</p>
                </div>
                <div class="lg:col-span-7">
                    <div class="bg-white rounded-[2.5rem] p-8 lg:p-10 soft-shadow border border-primary/5 relative">
                        <div class="absolute top-0 right-10 w-20 h-1 bg-accent rounded-b-lg"></div>
                        <h3 class="text-2xl font-extrabold text-primary mb-8">واقع نعيشه كلنا:</h3>
                        <div class="space-y-6">
                            ${product.pain.map((point, index) => `
                                <div class="flex gap-5 items-start">
                                    <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-500 font-extrabold flex items-center justify-center shrink-0 border border-red-100">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </div>
                                    <p class="font-bold text-charcoal text-lg leading-8 mt-1">${point}</p>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FDA & Authority Section (Image Left, Text Right) -->
        <!-- Note: in RTL, visually Image Left means the image is in the second column (order-2 in grid) or we force LTR for grid -->
        <section class="py-20 lg:py-28 bg-white border-y border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <!-- Text (Right visually in RTL -> first DOM element) -->
                    <div class="order-1">
                        <div class="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 border border-primary/10">
                            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <span class="text-accent font-extrabold text-sm tracking-wider">الجودة والأمان أولاً</span>
                        <h2 class="text-3xl lg:text-4xl font-extrabold text-primary mt-3 mb-6 leading-tight">${product.fdaTitle}</h2>
                        <p class="text-lg text-charcoal leading-9 mb-8">${product.fdaText}</p>
                        
                        <div class="flex flex-wrap gap-4">
                            <div class="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
                                <div class="w-3 h-3 bg-success rounded-full"></div>
                                <span class="font-bold text-sm text-charcoal">ممارسات تصنيع جيدة (GMP)</span>
                            </div>
                            <div class="bg-gray-50 border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
                                <div class="w-3 h-3 bg-success rounded-full"></div>
                                <span class="font-bold text-sm text-charcoal">منشأة مسجلة عالمياً</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Image (Left visually in RTL -> second DOM element) -->
                    <div class="order-2 aspect-[4/3] w-full">
                        ${imagePlaceholder('صورة توضيحية لشهادات الجودة والمصنع')}
                    </div>
                </div>
            </div>
        </section>

        <!-- Science & Proof Section -->
        <section class="py-20 lg:py-28 bg-secondary/30 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div class="order-2 lg:order-1 aspect-square w-full">
                        ${imagePlaceholder('رسم بياني علمي أو صورة للمكونات بشكل احترافي')}
                    </div>
                    <div class="order-1 lg:order-2">
                        <span class="text-accent font-extrabold text-sm tracking-wider">مدعوم بالدليل</span>
                        <h2 class="text-3xl lg:text-4xl font-extrabold text-primary mt-3 mb-6 leading-tight">${product.scienceTitle}</h2>
                        <p class="text-lg text-charcoal leading-9 mb-6">${product.scienceText}</p>
                        <p class="text-md text-muted leading-8 p-5 bg-white/60 backdrop-blur border border-white rounded-2xl shadow-sm italic">
                            "${product.proof}"
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Ingredients Section -->
        <section id="ingredients" class="py-20 lg:py-28 bg-cream">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="text-center max-w-3xl mx-auto mb-16">
                    <span class="text-accent font-extrabold text-sm tracking-wider block mb-2">التركيبة الفعالة</span>
                    <h2 class="text-3xl lg:text-5xl font-extrabold text-primary mb-6">ليش ميزاني يعطيك نتيجة فعلية؟</h2>
                    <p class="text-lg text-muted leading-8">لأننا نستخدم المكونات اللي يحتاجها جسمك بالجرعات الصحيحة، وبشكل يخليك تستمر عليها بدون ملل.</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
                    ${product.ingredients.map(([title, text], idx) => `
                        <div class="bg-white rounded-[2.5rem] p-8 border border-primary/5 soft-shadow hover:-translate-y-2 transition-all duration-300">
                            <div class="w-16 h-16 rounded-2xl bg-primary text-cream flex items-center justify-center font-extrabold text-xl mb-6 shadow-lg shadow-primary/20">
                                0${idx + 1}
                            </div>
                            <h3 class="text-2xl font-extrabold text-primary mb-4">${title}</h3>
                            <p class="text-muted leading-8 font-medium">${text}</p>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>

        <!-- Social Proof / Reviews Section -->
        <section id="reviews" class="py-20 lg:py-28 bg-white border-t border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6">
                <div class="text-center mb-16">
                    <h2 class="text-3xl lg:text-5xl font-extrabold text-primary mb-6">ماذا يقول عملاء ميزاني؟</h2>
                    <div class="flex items-center justify-center gap-2 text-accent text-xl">
                        ★★★★★
                        <span class="text-charcoal font-bold text-sm ml-2">4.8/5 متوسط التقييمات</span>
                    </div>
                </div>
                
                <div class="grid md:grid-cols-3 gap-6">
                    ${product.reviews.map((rev) => `
                        <div class="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                            <div class="flex items-center gap-1 text-accent mb-4">
                                ${Array(rev.rating).fill('★').join('')}
                            </div>
                            <p class="text-lg text-charcoal leading-9 mb-6 font-medium">"${rev.text}"</p>
                            <div class="flex items-center gap-4 mt-auto">
                                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    ${rev.name.split(' ')[0][0]}
                                </div>
                                <div>
                                    <p class="font-extrabold text-primary text-sm">${rev.name}</p>
                                    <p class="text-xs text-success font-bold mt-0.5 flex items-center gap-1">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                        مشتري مؤكد
                                    </p>
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
                
                <div class="mt-12 text-center">
                    <div class="inline-block px-8 py-4 bg-primary/5 rounded-2xl">
                        <p class="text-primary font-bold">عشرات التقييمات الإيجابية يومياً.. التجربة خير برهان.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Final CTA Section -->
        <section class="py-20 lg:py-28 bg-primary relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(201,143,106,0.3),transparent_60%)]"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div class="text-cream text-center lg:text-right">
                    <span class="text-accent font-extrabold tracking-widest text-sm uppercase mb-4 block">اطلب بدون مخاطرة</span>
                    <h2 class="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">جاهز تبدأ روتينك الجديد؟</h2>
                    <p class="text-lg text-white/80 leading-9 mb-8 max-w-xl mx-auto lg:mx-0">
                        الكمية المتاحة للتوصيل الفوري محدودة. اختر الباقة المناسبة، اكتب معلوماتك، وفريقنا بيتصل بك للتأكيد قبل إرسال الطلب. الدفع عند الاستلام.
                    </p>
                    <ul class="text-right space-y-4 text-white/90 font-bold max-w-md mx-auto lg:mx-0 hidden lg:block">
                        <li class="flex items-center gap-3"><span class="text-accent">✓</span> ضمان 30 يوم</li>
                        <li class="flex items-center gap-3"><span class="text-accent">✓</span> شحن مجاني للباقة الكبرى</li>
                        <li class="flex items-center gap-3"><span class="text-accent">✓</span> دعم عبر الواتساب متواصل</li>
                    </ul>
                </div>
                <div class="bg-white/5 p-2 rounded-[2.5rem]">
                    ${offerSelector(slug)}
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="py-20 lg:py-28 bg-cream">
            <div class="max-w-3xl mx-auto px-4 sm:px-6">
                <div class="text-center mb-12">
                    <h2 class="text-3xl lg:text-5xl font-extrabold text-primary mb-4">أسئلة تهمك قبل الطلب</h2>
                    <p class="text-muted">نحن هنا للإجابة بكل شفافية</p>
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
                        <p class="text-muted leading-8 font-medium">قطعاً لا. منتجات ميزاني هي مكملات غذائية لدعم الصحة العامة وليست أدوية طبية لغرض التشخيص أو العلاج.</p>
                    </div>
                    <div class="bg-white rounded-2xl p-6 border border-primary/10 shadow-sm">
                        <strong class="text-primary text-lg block mb-2">إذا ما ناسبني المنتج؟</strong>
                        <p class="text-muted leading-8 font-medium">نقدم ضمان ذهبي لتجربة المنتج. يمكنك التواصل معنا عبر الواتساب في حال وجود أي مشكلة وسنقوم بخدمتك لضمان رضاك التام.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mobile Sticky CTA -->
        <div class="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-primary/10 p-4 z-50 lg:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <button data-add-product="${slug}" class="w-full bg-primary text-cream font-extrabold text-lg py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2">
                اطلب الآن - الدفع عند الاستلام
            </button>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    renderProductPage(document.body.dataset.productSlug);
});