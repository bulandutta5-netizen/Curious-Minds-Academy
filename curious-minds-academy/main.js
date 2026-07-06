/* ==========================================================================
   CORE JAVASCRIPT - CURIOUS MINDS ACADEMY
   ========================================================================== */

// Core initialization wrapper
const initAcademyWebsite = () => {
    // Initialize active navigation links based on current path
    initActiveNavLinks();

    // Initialize preloader
    initPreloader();

    // Initialize sticky header
    initStickyHeader();
    initHeaderTheme();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize dark/light mode toggle
    initThemeEngine();

    // Initialize scroll animation observer
    initScrollAnimations();

    // Initialize stats counter
    initStatsCounter();

    // Initialize testimonial slider
    initTestimonialSlider();

    // Initialize FAQ accordion
    initFaqAccordion();

    // Initialize gallery lightbox
    initGalleryLightbox();

    // Initialize enquire modal
    initEnquireModal();

    // Initialize form validations and local database saves
    initFormValidators();

    // Initialize course filters (for courses page)
    initCourseFilters();

    // Initialize results filters (for results page)
    initResultsFilters();

    // Initialize admission wizard (for admission page)
    initAdmissionWizard();
};

// Guarantee execution under all load states
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAcademyWebsite);
} else {
    initAcademyWebsite();
}

/* ==========================================================================
   1. ACTIVE NAVIGATION LINKS
   ========================================================================== */
function initActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;
        
        if (linkHref === pageName || (pageName === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ==========================================================================
   2. PRELOADER
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hidePreloader = () => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.remove();
            }
        }, 600);
    };

    // If page is already loaded, remove immediately
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
        // Fallback: Max wait of 1 second to ensure page becomes visible quickly
        setTimeout(hidePreloader, 1000);
    }
}

/* ==========================================================================
   3. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
    const header = document.querySelector('header');
    const scrollToTop = document.getElementById('scroll-to-top');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide scroll to top button
        if (scrollToTop) {
            if (window.scrollY > 500) {
                scrollToTop.classList.add('visible');
            } else {
                scrollToTop.classList.remove('visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run initially in case of refreshed page scrolled down

    if (scrollToTop) {
        scrollToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* ==========================================================================
   4. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

/* ==========================================================================
   5. THEME ENGINE (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeEngine() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

/* ==========================================================================
   6. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal, .scale-reveal');
    if (reveals.length === 0) return;

    // Fail-safe: If IntersectionObserver is not supported, reveal all immediately
    if (!window.IntersectionObserver) {
        reveals.forEach(element => {
            element.classList.add('visible');
        });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05 // Lower threshold (5%) to make sure elements trigger easily on mobile
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    reveals.forEach(element => {
        observer.observe(element);
    });
}

/* ==========================================================================
   7. INTERACTIVE STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
    const statsSection = document.querySelector('.stats-banner, .about-stats-grid, .about-stats, .stats-grid');
    const counters = document.querySelectorAll('.counter-value');
    if (counters.length === 0 || !statsSection) return;

    let animated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const stepTime = 30;
            const steps = Math.ceil(duration / stepTime);
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target + (counter.getAttribute('data-suffix') || '');
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
                }
            }, stepTime);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounters();
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(statsSection);
}

/* ==========================================================================
   8. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoPlayInterval;
    const intervalTime = 5000; // 5 seconds

    // Create Navigation Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = ''; // Clear prior if any
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    const updateDots = () => {
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const goToSlide = (index) => {
        currentIndex = index;
        if (currentIndex >= slides.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = slides.length - 1;
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    };

    const nextSlide = () => {
        goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
        goToSlide(currentIndex - 1);
    };

    // Button controls
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    // Auto Play
    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, intervalTime);
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    // Pause on Hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', startAutoPlay);

    // Touch Swipe Support
    let startX = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isSwiping = true;
        clearInterval(autoPlayInterval);
    });

    track.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const diff = startX - currentX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            isSwiping = false;
        }
    });

    track.addEventListener('touchend', () => {
        isSwiping = false;
        startAutoPlay();
    });

    startAutoPlay();
}

/* ==========================================================================
   9. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const faqItem = trigger.parentElement;
            const faqContent = trigger.nextElementSibling;
            const isActive = faqItem.classList.contains('active');

            // Close all active FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-content').style.maxHeight = '0px';
            });

            // Toggle current FAQ
            if (!isActive) {
                faqItem.classList.add('active');
                faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
            }
        });
    });
}

/* ==========================================================================
   10. GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length === 0 || !lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Build array of images for slider inside lightbox
    const imagesData = Array.from(galleryItems).map(item => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-overlay h4')?.innerText || img.getAttribute('alt') || 'Gallery Image';
        return {
            src: img.getAttribute('src'),
            title: title
        };
    });

    let activeImageIndex = 0;

    const openLightbox = (index) => {
        activeImageIndex = index;
        const currentData = imagesData[activeImageIndex];
        
        lightboxImg.setAttribute('src', currentData.src);
        lightboxCaption.innerText = currentData.title;
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    const navigateLightbox = (direction) => {
        activeImageIndex += direction;
        if (activeImageIndex >= imagesData.length) activeImageIndex = 0;
        if (activeImageIndex < 0) activeImageIndex = imagesData.length - 1;
        
        const currentData = imagesData[activeImageIndex];
        lightboxImg.setAttribute('src', currentData.src);
        lightboxCaption.innerText = currentData.title;
    };

    // Bind triggers
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));
    if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));

    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
    });
}

/* ==========================================================================
   11. ENQUIRE NOW MODAL
   ========================================================================== */
function initEnquireModal() {
    const triggers = document.querySelectorAll('.btn-enquire, .nav-btn-enquire');
    const modal = document.getElementById('enquire-modal');
    
    if (triggers.length === 0 || !modal) return;

    const closeBtn = modal.querySelector('.modal-close');

    const openModal = () => {
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

/* ==========================================================================
   12. FORM VALIDATIONS & LOCAL DATABASE
   ========================================================================== */
function initFormValidators() {
    const contactForm = document.getElementById('contact-form');
    const enquireForm = document.getElementById('enquire-form');
    const newsletterForm = document.getElementById('newsletter-form');

    // Validation patterns
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^[6-9]\d{9}$/; // India phone format (10 digits starting with 6-9)

    const showMessage = (element, message, type = 'error') => {
        // Remove existing alerts
        const parent = element.parentElement;
        const existingAlert = parent.querySelector('.form-alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.classList.add('form-alert');
        alert.style.fontSize = '0.75rem';
        alert.style.marginTop = '0.25rem';
        alert.style.fontWeight = '500';
        alert.style.color = type === 'error' ? '#EF4444' : '#10B981';
        alert.innerText = message;
        
        parent.appendChild(alert);
        
        // Remove error border on focus
        element.style.borderColor = type === 'error' ? '#EF4444' : '#10B981';
    };

    const clearAlerts = (form) => {
        form.querySelectorAll('.form-alert').forEach(alert => alert.remove());
        form.querySelectorAll('.form-input').forEach(input => input.style.borderColor = '');
    };

    // 1. CONTACT FORM
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAlerts(contactForm);

            const name = contactForm.querySelector('#contact-name');
            const email = contactForm.querySelector('#contact-email');
            const phone = contactForm.querySelector('#contact-phone');
            const subject = contactForm.querySelector('#contact-subject');
            const message = contactForm.querySelector('#contact-message');

            let isValid = true;

            if (name.value.trim() === '') {
                showMessage(name, 'Please enter your full name');
                isValid = false;
            }
            if (!emailPattern.test(email.value.trim())) {
                showMessage(email, 'Please enter a valid email address');
                isValid = false;
            }
            if (!phonePattern.test(phone.value.trim())) {
                showMessage(phone, 'Please enter a valid 10-digit mobile number');
                isValid = false;
            }
            if (subject.value.trim() === '') {
                showMessage(subject, 'Please select a subject');
                isValid = false;
            }
            if (message.value.trim().length < 10) {
                showMessage(message, 'Message must be at least 10 characters long');
                isValid = false;
            }

            if (isValid) {
                // Save to localStorage DB
                const submission = {
                    id: Date.now(),
                    type: 'contact',
                    name: name.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    subject: subject.value.trim(),
                    message: message.value.trim(),
                    date: new Date().toISOString()
                };

                const db = JSON.parse(localStorage.getItem('cma_inquiries') || '[]');
                db.push(submission);
                localStorage.setItem('cma_inquiries', JSON.stringify(db));

                // Success Message & Animation
                contactForm.innerHTML = `
                    <div class="text-center" style="padding: 2rem 0; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
                        <div style="width: 70px; height: 70px; background-color: rgba(16, 185, 129, 0.1); color: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">✓</div>
                        <h3 class="text-gradient">Thank You, ${name.value.trim()}!</h3>
                        <p style="color: var(--text-secondary); max-width: 400px;">Your message has been received successfully. Our admissions team will get back to you within 24 hours.</p>
                        <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Back to Home</a>
                    </div>
                `;

                // Auto Trigger WhatsApp Integration
                const whatsappText = encodeURIComponent(`Hi Curious Minds Academy, I'm ${submission.name}. I've sent an inquiry regarding ${submission.subject}. Please connect with me.`);
                setTimeout(() => {
                    window.open(`https://wa.me/919898221800?text=${whatsappText}`, '_blank');
                }, 2000);
            }
        });
    }

    // 2. ENQUIRE MODAL FORM
    if (enquireForm) {
        enquireForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearAlerts(enquireForm);

            const name = enquireForm.querySelector('#enquire-name');
            const phone = enquireForm.querySelector('#enquire-phone');
            const course = enquireForm.querySelector('#enquire-course');

            let isValid = true;

            if (name.value.trim() === '') {
                showMessage(name, 'Please enter your full name');
                isValid = false;
            }
            if (!phonePattern.test(phone.value.trim())) {
                showMessage(phone, 'Please enter a valid 10-digit mobile number');
                isValid = false;
            }
            if (course.value.trim() === '') {
                showMessage(course, 'Please select a course');
                isValid = false;
            }

            if (isValid) {
                const submission = {
                    id: Date.now(),
                    type: 'modal_enquiry',
                    name: name.value.trim(),
                    phone: phone.value.trim(),
                    course: course.value.trim(),
                    date: new Date().toISOString()
                };

                const db = JSON.parse(localStorage.getItem('cma_inquiries') || '[]');
                db.push(submission);
                localStorage.setItem('cma_inquiries', JSON.stringify(db));

                const container = enquireForm.closest('.modal-container');
                container.innerHTML = `
                    <button class="modal-close" onclick="document.getElementById('enquire-modal').classList.remove('active'); document.body.classList.remove('no-scroll');">&times;</button>
                    <div class="text-center" style="padding: 2rem 0; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
                        <div style="width: 70px; height: 70px; background-color: rgba(16, 185, 129, 0.1); color: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">✓</div>
                        <h3 class="text-gradient">Slot Booked!</h3>
                        <p style="color: var(--text-secondary);">Congratulations ${name.value.trim()}! Your demo session for **${course.value.trim()}** is registered.</p>
                        <button class="btn btn-primary" onclick="document.getElementById('enquire-modal').classList.remove('active'); document.body.classList.remove('no-scroll');">Close Window</button>
                    </div>
                `;

                // Redirect to WhatsApp chat directly
                const whatsappText = encodeURIComponent(`Hi Curious Minds Academy, I'm ${submission.name}. I'd like to book a free demo for the ${submission.course} course.`);
                setTimeout(() => {
                    window.open(`https://wa.me/919898221800?text=${whatsappText}`, '_blank');
                }, 1500);
            }
        });
    }

    // 3. FOOTER NEWSLETTER FORM
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('.newsletter-input');
            const alertBox = newsletterForm.parentElement.querySelector('.newsletter-alert') || document.createElement('div');
            
            if (!input) return;

            if (!emailPattern.test(input.value.trim())) {
                alertBox.classList.add('newsletter-alert');
                alertBox.style.fontSize = '0.75rem';
                alertBox.style.marginTop = '0.5rem';
                alertBox.style.color = '#EF4444';
                alertBox.innerText = 'Invalid email address.';
                if (!newsletterForm.parentElement.querySelector('.newsletter-alert')) {
                    newsletterForm.parentElement.appendChild(alertBox);
                }
            } else {
                const sub = {
                    id: Date.now(),
                    email: input.value.trim(),
                    date: new Date().toISOString()
                };
                const subs = JSON.parse(localStorage.getItem('cma_subscribers') || '[]');
                subs.push(sub);
                localStorage.setItem('cma_subscribers', JSON.stringify(subs));

                alertBox.classList.add('newsletter-alert');
                alertBox.style.fontSize = '0.75rem';
                alertBox.style.marginTop = '0.5rem';
                alertBox.style.color = '#10B981';
                alertBox.innerText = 'Subscribed successfully! Thank you.';
                if (!newsletterForm.parentElement.querySelector('.newsletter-alert')) {
                    newsletterForm.parentElement.appendChild(alertBox);
                }
                input.value = '';
            }
        });
    }
}

/* ==========================================================================
   13. COURSE FILTERS
   ========================================================================== */
function initCourseFilters() {
    const filterContainer = document.querySelector('.courses-filters');
    const grid = document.querySelector('.courses-grid');
    if (!filterContainer || !grid) return;

    const buttons = filterContainer.querySelectorAll('.filter-btn');
    const cards = grid.querySelectorAll('.course-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterVal === 'all' || category === filterVal) {
                    card.style.display = 'flex';
                    // Trigger fade animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   14. RESULTS FILTERS
   ========================================================================== */
function initResultsFilters() {
    const filterContainer = document.querySelector('.results-filters');
    const grid = document.querySelector('.results-grid');
    if (!filterContainer || !grid) return;

    const buttons = filterContainer.querySelectorAll('.filter-btn');
    const cards = grid.querySelectorAll('.result-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterVal === 'all' || category === filterVal) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   15. ADMISSION WIZARD (MULTIPAGE FORM & DASHBOARD)
   ========================================================================== */
function initAdmissionWizard() {
    const wizard = document.getElementById('admission-wizard');
    if (!wizard) return;

    const progress = wizard.querySelector('.wizard-progress');
    const steps = wizard.querySelectorAll('.wizard-step');
    const panels = wizard.querySelectorAll('.wizard-panel');
    const prevBtn = wizard.querySelector('.btn-prev');
    const nextBtn = wizard.querySelector('.btn-next');
    const form = wizard.querySelector('form');

    if (!progress || steps.length === 0 || panels.length === 0 || !prevBtn || !nextBtn || !form) return;

    let currentStep = 0;

    const updateWizard = () => {
        // Update progress bar
        const percent = (currentStep / (steps.length - 1)) * 100;
        progress.style.width = percent + '%';

        // Update step dots status
        steps.forEach((step, idx) => {
            if (idx <= currentStep) {
                step.classList.add('completed');
            } else {
                step.classList.remove('completed');
            }

            if (idx === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Toggle panel display
        panels.forEach((panel, idx) => {
            if (idx === currentStep) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Toggle buttons visibility
        if (currentStep === 0) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }

        if (currentStep === steps.length - 1) {
            nextBtn.innerText = 'Submit Admission';
            nextBtn.classList.add('btn-accent');
        } else {
            nextBtn.innerText = 'Next Step';
            nextBtn.classList.remove('btn-accent');
        }
    };

    const validateStep = (stepIdx) => {
        const panel = panels[stepIdx];
        const requiredInputs = panel.querySelectorAll('[required]');
        let isStepValid = true;

        requiredInputs.forEach(input => {
            // Clear prior error
            const parent = input.parentElement;
            const existingAlert = parent.querySelector('.form-alert');
            if (existingAlert) existingAlert.remove();
            input.style.borderColor = '';

            if (input.value.trim() === '') {
                const label = parent.querySelector('label')?.innerText || 'This field';
                const alert = document.createElement('div');
                alert.classList.add('form-alert');
                alert.style.fontSize = '0.75rem';
                alert.style.marginTop = '0.25rem';
                alert.style.color = '#EF4444';
                alert.innerText = `${label} is required.`;
                parent.appendChild(alert);
                input.style.borderColor = '#EF4444';
                isStepValid = false;
            } else if (input.type === 'email' && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(input.value.trim())) {
                const alert = document.createElement('div');
                alert.classList.add('form-alert');
                alert.style.fontSize = '0.75rem';
                alert.style.marginTop = '0.25rem';
                alert.style.color = '#EF4444';
                alert.innerText = 'Invalid email address format.';
                parent.appendChild(alert);
                input.style.borderColor = '#EF4444';
                isStepValid = false;
            } else if (input.id.includes('phone') && !/^[6-9]\d{9}$/.test(input.value.trim())) {
                const alert = document.createElement('div');
                alert.classList.add('form-alert');
                alert.style.fontSize = '0.75rem';
                alert.style.marginTop = '0.25rem';
                alert.style.color = '#EF4444';
                alert.innerText = 'Please enter a valid 10-digit mobile number.';
                parent.appendChild(alert);
                input.style.borderColor = '#EF4444';
                isStepValid = false;
            }
        });

        return isStepValid;
    };

    nextBtn.addEventListener('click', () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < steps.length - 1) {
            currentStep++;
            updateWizard();
        } else {
            // Submit form
            const formData = new FormData(form);
            const admission = {
                id: Date.now(),
                type: 'admission',
                studentName: formData.get('student_name'),
                studentDob: formData.get('student_dob'),
                studentGender: formData.get('student_gender'),
                parentName: formData.get('parent_name'),
                phone: formData.get('parent_phone'),
                email: formData.get('parent_email'),
                address: formData.get('student_address'),
                grade: formData.get('student_grade'),
                course: formData.get('student_course'),
                board: formData.get('student_board'),
                date: new Date().toISOString()
            };

            const db = JSON.parse(localStorage.getItem('cma_admissions') || '[]');
            db.push(admission);
            localStorage.setItem('cma_admissions', JSON.stringify(db));

            // Show Success Board
            wizard.innerHTML = `
                <div class="card text-center" style="padding: 4rem 3rem; display: flex; flex-direction: column; align-items: center; gap: 2rem;">
                    <div style="width: 90px; height: 90px; background-color: rgba(16, 185, 129, 0.1); color: #10B981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem;">✓</div>
                    <h2 class="text-gradient" style="font-size: 2.25rem;">Application Submitted!</h2>
                    <p style="color: var(--text-secondary); max-width: 500px; font-size: 1.05rem; line-height: 1.6;">
                        Thank you for applying. We have registered **${admission.studentName}** for the **${admission.course}** batch.
                    </p>
                    
                    <div style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; text-align: left; width: 100%; max-width: 450px;">
                        <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Application Reference</h4>
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Registration ID:</strong> CMA-2026-${admission.id.toString().slice(-5)}</p>
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Student Name:</strong> ${admission.studentName}</p>
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Target Course:</strong> ${admission.course}</p>
                        <p style="font-size: 0.9rem;"><strong>Target Grade:</strong> Class ${admission.grade}</p>
                    </div>

                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                        <a href="index.html" class="btn btn-primary">Back to Home</a>
                        <button class="btn btn-accent" id="btn-wa-admit">Connect on WhatsApp</button>
                    </div>
                </div>
            `;

            // WhatsApp connection binding
            document.getElementById('btn-wa-admit').addEventListener('click', () => {
                const whatsappText = encodeURIComponent(`Hello Curious Minds Academy! I have submitted an admission application for ${admission.studentName} for the ${admission.course} batch. Reference ID: CMA-2026-${admission.id.toString().slice(-5)}.`);
                window.open(`https://wa.me/919898221800?text=${whatsappText}`, '_blank');
            });
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateWizard();
        }
    });

    updateWizard();
}

/* ==========================================================================
   16. POSTER LIGHTBOX FOR ACHIEVEMENTS
   ========================================================================== */
window.openPosterLightbox = function(src, caption) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    if (lightboxImg && lightboxCaption) {
        lightboxImg.setAttribute('src', src);
        lightboxCaption.innerText = caption;
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
        
        // Hide prev/next buttons for single poster view
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
};

window.closePosterLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
};

/* ==========================================================================
   17. HEADER THEME FOR SUBPAGES (CONTRAST ON DARK HEROES)
   ========================================================================== */
function initHeaderTheme() {
    const header = document.querySelector('header');
    const pageHero = document.querySelector('.page-hero');
    if (!header || !pageHero) return;
    
    // Add class indicating header overlaying a dark page-hero
    header.classList.add('header-on-dark');
}
