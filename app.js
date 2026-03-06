document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Slight delay for the outline for a smooth effect
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Make cursor bigger on interactive elements
    const interactables = document.querySelectorAll('a, button, .slider-btn, .am-item, .phase-slide');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
            cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            cursorOutline.style.border = '1px solid rgba(212, 175, 55, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.border = '1px solid rgba(212, 175, 55, 0.5)';
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .scroll-reveal');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Trigger hero animations immediately
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('active'));
    }, 100);

    // 4. Parallax Effect for Hero Image
    const heroImg = document.querySelector('.parallax-img');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // 5. Horizontal Phase Slider Logic
    const sliderContainer = document.getElementById('phaseSlider');
    const btnNext = document.getElementById('sliderNext');
    const btnPrev = document.getElementById('sliderPrev');

    if (sliderContainer && btnNext && btnPrev) {
        // Scroll amount is roughly one slide width + gap
        const scrollAmount = 640;

        btnNext.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        btnPrev.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Optional Drag to scroll (Vanilla JS Desktop support)
        let isDown = false;
        let startX;
        let scrollLeft;

        sliderContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderContainer.classList.add('active');
            startX = e.pageX - sliderContainer.offsetLeft;
            scrollLeft = sliderContainer.scrollLeft;
        });
        sliderContainer.addEventListener('mouseleave', () => {
            isDown = false;
            sliderContainer.classList.remove('active');
        });
        sliderContainer.addEventListener('mouseup', () => {
            isDown = false;
            sliderContainer.classList.remove('active');
        });
        sliderContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast factor
            sliderContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // 6. Enquiry Modal Logic
    const modalOverlay = document.getElementById('enquiryModal');
    const openBtns = document.querySelectorAll('.open-modal');
    const closeBtn = document.querySelector('.close-modal');
    const leadForm = document.getElementById('leadForm');

    const openModal = () => modalOverlay.classList.add('active');
    const closeModal = () => modalOverlay.classList.remove('active');

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Lead Magnet Logic
            const magnet = btn.getAttribute('data-magnet');
            const modalTitle = modalOverlay.querySelector('h2');
            if (magnet === 'brochure') {
                modalTitle.innerText = 'Download Elite Brochure';
            } else if (magnet === 'pricesheet') {
                modalTitle.innerText = 'Request Luxury Price Sheet';
            } else {
                modalTitle.innerText = modalTitle.getAttribute('data-en-original') || 'Register Your Interest';
            }

            // If button is within a specific phase slide, pre-select that option
            const parentSlide = btn.closest('.phase-slide');
            if (parentSlide && leadForm) {
                const selectElement = leadForm.querySelector('select');
                const phaseTitle = parentSlide.querySelector('h3').textContent;

                if (phaseTitle.includes('Everlyn')) selectElement.value = 'everlyn-tower';
                if (phaseTitle.includes('Arcadia')) selectElement.value = 'arcadia-3bhk';
                if (phaseTitle.includes('Icon')) selectElement.value = 'icon-4bhk';
                if (phaseTitle.includes('Della')) selectElement.value = 'della-villa';
            }

            openModal();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // 7. Appreciation Ticker Logic
    const tickerSlides = document.querySelectorAll('.ticker-slide');
    if (tickerSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            tickerSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % tickerSlides.length;
            tickerSlides[currentSlide].classList.add('active');
        }, 3000);
    }

    // 8. ROI Chart Animation
    const chartBars = document.querySelectorAll('.chart-bar');
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetHeight = bar.style.height;
                bar.style.height = '0'; // Reset for animation
                setTimeout(() => {
                    bar.style.height = targetHeight;
                }, 100);
                chartObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    chartBars.forEach(bar => chartObserver.observe(bar));

    // 9. PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(reg => {
                // Registered
            }).catch(err => { });
        });
    }



    // 11. ROI & EMI Calculators
    const roiAmount = document.getElementById('roi-amount');
    const roiGrowth = document.getElementById('roi-growth');
    const roiYears = document.getElementById('roi-years');
    const roiResult = document.getElementById('roi-result');

    function updateROI() {
        if (!roiAmount || !roiGrowth || !roiYears) return;
        const p = parseFloat(roiAmount.value);
        const r = parseFloat(roiGrowth.value) / 100;
        const n = parseFloat(roiYears.value);
        const result = p * Math.pow((1 + r), n);
        roiResult.innerText = `₹ ${result.toFixed(2)} Cr`;
        roiGrowth.nextElementSibling.innerText = `${roiGrowth.value}%`;
        roiYears.nextElementSibling.innerText = `${roiYears.value} Years`;
    }

    [roiAmount, roiGrowth, roiYears].forEach(el => {
        if (el) el.addEventListener('input', updateROI);
    });

    const emiAmount = document.getElementById('emi-amount');
    const emiRate = document.getElementById('emi-rate');
    const emiTenure = document.getElementById('emi-tenure');
    const emiResult = document.getElementById('emi-result');

    function updateEMI() {
        if (!emiAmount || !emiRate || !emiTenure) return;
        const p = parseFloat(emiAmount.value) * 100000;
        const r = parseFloat(emiRate.value) / 12 / 100;
        const n = parseFloat(emiTenure.value) * 12;
        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        emiResult.innerText = `₹ ${Math.round(emi).toLocaleString('en-IN')}`;
    }

    [emiAmount, emiRate, emiTenure].forEach(el => {
        if (el) el.addEventListener('input', updateEMI);
    });

    // 12. Marathi Translation Content Mapping
    const translations = {
        mr: {
            'The Legacy': 'वारसा',
            'Masterplan': 'मास्टर प्लॅन',
            'Phases': 'टप्पे',
            'Amenities': 'सुविधा',
            'Location': 'ठिकाण',
            'Inquire': 'चौकशी करा',
            'Plan Your Investment': 'तुमच्या गुंतवणुकीचे नियोजन करा',
            'Appreciation Calculator': 'वाढ मोजण्याचे साधन',
            'EMI Estimator': 'ईएमआय अंदाजपत्रक',
            'The Community of Titans': 'दिग्गजांचा समुदाय',
            'A Glimpse of Magnificence': 'भव्यतेची एक झलक',
            'Register Now for Pre-Launch Offers': 'प्री-लाँच ऑफरसाठी आताच नोंदणी करा'
        }
    };

    // 13. Dynamic Translation Engine
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langBtns = langToggle.querySelectorAll('button');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedLang = btn.getAttribute('data-lang');
                langBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                document.body.setAttribute('data-lang', selectedLang);
                translatePage(selectedLang);
            });
        });
    }

    function translatePage(lang) {
        document.querySelectorAll('[data-en]').forEach(el => {
            if (lang === 'mr') {
                if (!el.getAttribute('data-en-original')) el.setAttribute('data-en-original', el.innerText);
                el.innerText = el.getAttribute('data-mr');
            } else {
                el.innerText = el.getAttribute('data-en-original') || el.innerText;
            }
        });

        // Translate placeholders
        document.querySelectorAll('input[placeholder]').forEach(input => {
            const key = input.getAttribute('placeholder');
            const translation = translations.mr[key];
            if (lang === 'mr' && translation) {
                if (!input.getAttribute('data-en-ph')) input.setAttribute('data-en-ph', key);
                input.placeholder = translation;
            } else if (lang === 'en' && input.getAttribute('data-en-ph')) {
                input.placeholder = input.getAttribute('data-en-ph');
            }
        });
    }

    // 14. Find Your Masterpiece Quiz Logic
    const quizOverlay = document.getElementById('quizOverlay');
    const quizTrigger = document.querySelector('.quiz-trigger');
    const closeQuizBtns = document.querySelectorAll('.close-quiz');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizBar = document.getElementById('quizBar');
    const quizOptions = document.querySelectorAll('.quiz-opt');
    const restartBtn = document.getElementById('restartQuiz');
    const quizCta = document.getElementById('quizCta');

    let currentQuizStep = 0;
    let quizAnswers = {};

    const openQuiz = () => {
        quizOverlay.classList.add('active');
        resetQuiz();
    };

    const closeQuiz = () => {
        quizOverlay.classList.remove('active');
    };

    const resetQuiz = () => {
        currentQuizStep = 0;
        quizAnswers = {};
        updateQuizStep();
    };

    function updateQuizStep() {
        quizSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentQuizStep);
        });

        // Progress bar (Steps 1-3 = 33, 66, 100%)
        const progress = ((currentQuizStep + 1) / (quizSteps.length - 1)) * 100;
        if (quizBar) quizBar.style.width = `${Math.min(progress, 100)}%`;

        if (currentQuizStep === quizSteps.length - 1) {
            showRecommendation();
        }
    }

    function showRecommendation() {
        const resultTitle = document.getElementById('recommendedSector');
        const resultDesc = document.getElementById('recommendedDesc');

        let sector = "Arcadia";
        let desc = "Smartly planned 2 & 3 BHK residences for those who value space, community, and smart urban living.";
        let link = "#phases";

        if (quizAnswers[2] === 'villa' || quizAnswers[1] === 'luxury') {
            sector = "The Della Collection";
            desc = "India's first equestrian-themed villa plots with a private racecourse and 5-star resort amenities.";
            link = "della.html";
        } else if (quizAnswers[1] === 'wellness') {
            sector = "Everlyn Tower";
            desc = "A sanctuary of peace featuring zen gardens, yoga decks, and resort-style wellness apartments.";
            link = "everlyn.html";
        } else if (quizAnswers[2] === 'apartment-grand') {
            sector = "Icon Sector";
            desc = "The epitome of status with double-height spaces and expansive balconies overlooking the township.";
            link = "#phases";
        }

        if (resultTitle) resultTitle.innerText = sector;
        if (resultDesc) resultDesc.innerText = desc;
        if (quizCta) {
            quizCta.onclick = () => {
                window.location.href = link;
                closeQuiz();
            };
        }
    }

    if (quizTrigger) quizTrigger.addEventListener('click', openQuiz);
    closeQuizBtns.forEach(btn => btn.addEventListener('click', closeQuiz));
    if (restartBtn) restartBtn.addEventListener('click', resetQuiz);

    quizOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const step = opt.closest('.quiz-step').getAttribute('data-step');
            const value = opt.getAttribute('data-value');
            quizAnswers[step] = value;

            setTimeout(() => {
                currentQuizStep++;
                updateQuizStep();
            }, 300);
        });
    });
    // 15. Lead Form Submission (Restored Logic)
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Registering Priority Access...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = 'Enquiry Received!';
                submitBtn.style.background = '#28a745';
                submitBtn.style.color = 'white';

                setTimeout(() => {
                    const enquiryModal = document.getElementById('enquiryModal');
                    if (enquiryModal) enquiryModal.classList.remove('active');
                    leadForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1800);
        });
    }

    // 16. Dynamic Transit & Commute Matrix
    const commuteItems = document.querySelectorAll('.commute-item');
    if (commuteItems.length > 0) {
        setInterval(() => {
            commuteItems.forEach(item => {
                const timeEl = item.querySelector('.commute-time');
                const baseTime = parseInt(timeEl.getAttribute('data-base'));
                // Simulate "Live Traffic" fluctuation +/- 2 mins
                const fluctuation = Math.floor(Math.random() * 5) - 2;
                const finalTime = Math.max(baseTime + fluctuation, 5);
                timeEl.innerText = `${finalTime} Mins`;

                // Color coding based on traffic density simulation
                if (fluctuation > 1) timeEl.style.color = '#ff4444';
                else if (fluctuation < -1) timeEl.style.color = '#44ff44';
                else timeEl.style.color = 'var(--gold-primary)';
            });
        }, 5000);
    }
    // 17. UTM Parameter Capture & Attribution
    function captureUTM() {
        const urlParams = new URLSearchParams(window.location.search);
        const utms = ['utm_source', 'utm_medium', 'utm_campaign'];

        utms.forEach(utm => {
            const value = urlParams.get(utm);
            if (value) {
                sessionStorage.setItem(utm, value);
            }

            const input = document.getElementById(utm);
            const storedValue = sessionStorage.getItem(utm);
            if (input && storedValue) {
                input.value = storedValue;
            }
        });
    }

    // 18. Dynamic Inventory HUD
    function initInventoryHUD() {
        const hud = document.createElement('div');
        hud.className = 'inventory-hud scroll-reveal';
        hud.innerHTML = `
            <div class="hud-content">
                <i class="ph ph-warning-circle gold-icon"></i>
                <span>Only <strong>12 Della Villa Plots</strong> remaining for March 2026.</span>
            </div>
        `;
        document.body.appendChild(hud);

        // Show after 10 seconds
        setTimeout(() => {
            hud.classList.add('active');
        }, 10000);
    }

    // 19. Exit Intent Overlay Logic
    const exitOverlay = document.getElementById('exitOverlay');
    const closeExitBtn = document.querySelector('.close-exit');
    let exitShown = sessionStorage.getItem('exitShown') === 'true';

    function showExitIntent() {
        if (!exitShown && exitOverlay) {
            exitOverlay.classList.add('active');
            exitShown = true;
            sessionStorage.setItem('exitShown', 'true');
        }
    }

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0) {
            showExitIntent();
        }
    });

    if (closeExitBtn) {
        closeExitBtn.addEventListener('click', () => {
            exitOverlay.classList.remove('active');
        });
    }

    // 20. Recent Activity Social Proof Ticker
    const activityTicker = document.getElementById('activityTicker');
    const tickerText = document.getElementById('tickerText');
    const activities = [
        "A user from Mumbai just requested the Elite Brochure.",
        "Priority Access booked by a tech professional in Hinjewadi.",
        "Someone from Baner just viewed the Della Villa Plots.",
        "Investors from Dubai just secured interest in Icon Sector.",
        "New inquiry received for 3 BHK wellness duplexes."
    ];

    function updateSocialProof() {
        if (!activityTicker || !tickerText) return;

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        tickerText.innerText = randomActivity;

        // Show for 5 seconds every 15 seconds
        activityTicker.classList.add('active');
        setTimeout(() => {
            activityTicker.classList.remove('active');
        }, 5000);
    }

    // Start ticker after 30 seconds to avoid overwhelming immediately
    setTimeout(() => {
        updateSocialProof();
        setInterval(updateSocialProof, 20000);
    }, 30000);

    // 21. Lead Magnet A/B Test Logic (Simple)
    const primaryCTAs = document.querySelectorAll('.open-modal');
    const isTestGroup = Math.random() > 0.5; // Simple 50/50 split

    if (isTestGroup) {
        primaryCTAs.forEach(btn => {
            if (btn.innerText.toLowerCase().includes('register')) {
                btn.innerText = "Request Price Sheet";
                btn.setAttribute('data-ab-test', 'price-sheet');
            }
        });
    }

    // 22. Knowledge Hub Search / Filter Logic
    const hubSearch = document.getElementById('hubSearch');
    const articleGrid = document.getElementById('articleGrid');

    if (hubSearch && articleGrid) {
        const articles = articleGrid.querySelectorAll('.article-card');

        hubSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();

            articles.forEach(article => {
                const title = article.querySelector('h3').innerText.toLowerCase();
                const tag = article.querySelector('.article-tag').innerText.toLowerCase();
                const desc = article.querySelector('p').innerText.toLowerCase();

                if (title.includes(term) || tag.includes(term) || desc.includes(term)) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    }

    // 23. Exit Form Submission (WhatsApp Simulation)
    const exitForm = document.getElementById('exitForm');
    if (exitForm) {
        exitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = exitForm.querySelector('input[type="tel"]').value;
            const submitBtn = exitForm.querySelector('button');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Sending Report Link...";
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = "Sent to " + phone;
                submitBtn.style.background = "#25D366"; // WhatsApp Green

                setTimeout(() => {
                    if (exitOverlay) exitOverlay.classList.remove('active');
                    exitForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = "";
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // 24. Cinematic Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 2200); // Let the fill animation complete
        });
    }

    // 25. Scroll Progress Indicator
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        });
    }

    // 26. Lazy Loading Images with Blur-Up
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.onload = () => img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        lazyImages.forEach(img => imgObserver.observe(img));
    }

    // Also add loaded class to all existing images that are already loaded
    document.querySelectorAll('img:not([data-src])').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });

    // ===== PHASE 16: ANALYTICS & CONVERSION INTELLIGENCE =====

    // 27. CTA Event Tracking Layer
    const kxhAnalytics = {
        events: JSON.parse(sessionStorage.getItem('kxh_events') || '[]'),

        track(category, action, label) {
            const event = {
                category,
                action,
                label,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            };
            this.events.push(event);
            sessionStorage.setItem('kxh_events', JSON.stringify(this.events));
            console.log(`[KxH Analytics] ${category} | ${action} | ${label}`);
        },

        getEvents() { return this.events; },
        getEventCount(category) {
            return this.events.filter(e => e.category === category).length;
        }
    };

    // Track all CTA clicks
    document.querySelectorAll('.btn-primary, .btn-gold, .btn-outline, .btn-text').forEach(btn => {
        btn.addEventListener('click', () => {
            const label = btn.textContent.trim().substring(0, 50);
            const abTest = btn.getAttribute('data-ab-test') || 'control';
            kxhAnalytics.track('CTA', 'click', `${label} [${abTest}]`);
        });
    });

    // Track nav link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            kxhAnalytics.track('Navigation', 'click', link.textContent.trim());
        });
    });

    // 28. Scroll Depth Milestone Tracker
    const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = Math.round((scrollTop / docHeight) * 100);

        [25, 50, 75, 100].forEach(milestone => {
            if (percent >= milestone && !scrollMilestones[milestone]) {
                scrollMilestones[milestone] = true;
                kxhAnalytics.track('Scroll', 'depth', `${milestone}%`);
            }
        });
    });

    // 29. Session Engagement Timer with Idle Detection
    let sessionSeconds = parseInt(sessionStorage.getItem('kxh_session_time') || '0');
    let isIdle = false;
    let idleTimeout;

    function resetIdleTimer() {
        isIdle = false;
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => { isIdle = true; }, 30000); // 30s idle threshold
    }

    ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(evt => {
        document.addEventListener(evt, resetIdleTimer, { passive: true });
    });
    resetIdleTimer();

    setInterval(() => {
        if (!isIdle && !document.hidden) {
            sessionSeconds++;
            sessionStorage.setItem('kxh_session_time', sessionSeconds.toString());
        }
    }, 1000);

    // Expose analytics to window for dashboard
    window.kxhAnalytics = kxhAnalytics;
    window.kxhSessionTime = () => sessionSeconds;

    // ===== PHASE 17: PWA & OFFLINE EXPERIENCE =====

    // 30. Smart App Install Banner
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Show install banner after 60s engagement
        setTimeout(() => {
            if (!deferredPrompt) return;
            const banner = document.getElementById('installBanner');
            if (banner) banner.classList.add('active');
        }, 60000);
    });

    const installBtn = document.getElementById('installApp');
    const dismissBtn = document.getElementById('dismissInstall');
    const installBanner = document.getElementById('installBanner');

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                kxhAnalytics.track('PWA', 'install', 'accepted');
            }
            deferredPrompt = null;
            if (installBanner) installBanner.classList.remove('active');
        });
    }

    if (dismissBtn && installBanner) {
        dismissBtn.addEventListener('click', () => {
            installBanner.classList.remove('active');
            sessionStorage.setItem('installDismissed', 'true');
        });
    }

    // 31. Web Share API
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const shareData = {
                title: 'Krisala Hiranandani Township',
                text: "India's 1st Equestrian Township in Hinjewadi — 105+ Acres of Neoclassical Grandeur.",
                url: window.location.href
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                    kxhAnalytics.track('Share', 'native', window.location.pathname);
                } else {
                    // Fallback: copy to clipboard
                    await navigator.clipboard.writeText(window.location.href);
                    btn.textContent = 'Link Copied!';
                    setTimeout(() => { btn.innerHTML = '<i class="ph ph-share-network"></i> Share'; }, 2000);
                }
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        });
    });

    captureUTM();
    initInventoryHUD();
});
