document.addEventListener('DOMContentLoaded', () => {

    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    });

    document.getElementById('year').textContent = new Date().getFullYear();

    const progressBar = document.getElementById('progress-bar');
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";

        if (winScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (winScroll > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('nav-active'));
        navbar.classList.toggle('nav-open');
        document.body.style.overflow = navLinks.classList.contains('nav-active') ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
                navbar.classList.remove('nav-open');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    const animatedElements = document.querySelectorAll('.fade-in-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = '';
                    item.classList.remove('appear');
                    setTimeout(() => item.classList.add('appear'), 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const cards = document.querySelectorAll('.testimonial-card');

    let currentIndex = 0;

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= cards.length) {
            currentIndex = 0;
        }
        updateSlider();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = cards.length - 1;
        }
        updateSlider();
    });

    let autoSlide = setInterval(() => {
        nextBtn.click();
    }, 5000);

    const sliderContainer = document.querySelector('.testimonial-slider-container');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
    sliderContainer.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            nextBtn.click();
        }, 5000);
    });

    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            let startTimestamp = null;

            const animate = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);

                const easedProgress = 1 - Math.pow(1 - progress, 3);

                counter.innerText = Math.floor(easedProgress * target);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(animate);
        });
    };

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !countersStarted) {
                startCounters();
                countersStarted = true;
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    const phoneInput = document.querySelector("#phone");
    let iti;
    if (phoneInput) {
        iti = window.intlTelInput(phoneInput, {
            initialCountry: "auto",
            geoIpLookup: callback => {
                fetch("https://ipapi.co/json").then(res => res.json()).then(data => callback(data.country_code)).catch(() => callback("in"));
            },
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
        });
    }

    const form = document.getElementById('booking-form');
    if (form) {
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        const serviceOptions = form.querySelectorAll('.service-option input[type="checkbox"]');
        const messageTextarea = form.querySelector('#message');
        const charCounter = form.querySelector('.char-counter');
        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn?.querySelector('.btn-text');
        const btnLoader = btn?.querySelector('.btn-loader');
        const statusMessage = form.querySelector('.status-message');
        const originalBtnText = btnText ? btnText.textContent : 'REQUEST FREE QUOTE';

        function clearErrors() {
            form.querySelectorAll('.input-group').forEach(group => {
                group.classList.remove('error');
                const errorNode = group.querySelector('.error-message');
                if (errorNode) errorNode.remove();
            });
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
            form.classList.remove('form-success');
        }

        function showError(field, message) {
            const group = field.closest('.input-group');
            if (!group) return;
            group.classList.add('error');
            let errorNode = group.querySelector('.error-message');
            if (!errorNode) {
                errorNode = document.createElement('div');
                errorNode.className = 'error-message';
                group.appendChild(errorNode);
            }
            errorNode.textContent = message;
        }

        function updateCounter() {
            if (!messageTextarea || !charCounter) return;
            const maxLength = messageTextarea.getAttribute('maxlength') || 500;
            const currentLength = messageTextarea.value.length;
            charCounter.textContent = `${currentLength} / ${maxLength}`;
        }

        function resetServices() {
            serviceOptions.forEach(option => {
                option.checked = false;
                option.closest('.service-option')?.classList.remove('selected');
            });
        }

        requiredFields.forEach(field => {
            field.addEventListener('input', () => {
                clearErrors();
                if (field.checkValidity()) {
                    field.closest('.input-group')?.classList.remove('error');
                }
            });
            field.addEventListener('change', () => {
                clearErrors();
                if (field.checkValidity()) {
                    field.closest('.input-group')?.classList.remove('error');
                }
            });
        });

        serviceOptions.forEach(option => {
            option.addEventListener('change', () => {
                clearErrors();
                const optionCard = option.closest('.service-option');
                optionCard?.classList.toggle('selected', option.checked);
            });
        });

        if (messageTextarea) {
            messageTextarea.addEventListener('input', updateCounter);
            updateCounter();
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            let valid = true;

            requiredFields.forEach(field => {
                if (!field.checkValidity()) {
                    showError(field, field.validationMessage || 'This field is required.');
                    valid = false;
                }
            });

            if (phoneInput && !iti.isValidNumber()) {
                showError(phoneInput, 'Please enter a valid phone number for your region.');
                valid = false;
            } else if (phoneInput) {
                phoneInput.setCustomValidity('');
            }

            if (!valid) {
                statusMessage.textContent = 'Please complete the highlighted fields to continue.';
                statusMessage.className = 'status-message error';
                return;
            }

            btn.disabled = true;
            btn.classList.add('is-loading');
            if (btnText) btnText.textContent = 'Submitting...';
            if (btnLoader) btnLoader.setAttribute('aria-hidden', 'false');

            const formData = new FormData(form);
            if (iti) formData.set('phone', iti.getNumber());

            setTimeout(() => {
                btn.disabled = false;
                btn.classList.remove('is-loading');
                if (btnText) btnText.textContent = originalBtnText;
                form.classList.add('form-success');
                statusMessage.textContent = 'Thank you! Your premium inquiry has been received. We will contact you within 24 hours.';
                statusMessage.className = 'status-message success';

                form.reset();
                resetServices();
                if (messageTextarea) {
                    messageTextarea.value = '';
                    updateCounter();
                }
                if (phoneInput) {
                    phoneInput.value = '';
                    if (iti) {
                        iti.setNumber('');
                    }
                }
            }, 1400);
        });
    }

    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateSlider();

        if (window.innerWidth > 768 && navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            navbar.classList.remove('nav-open');
            document.body.style.overflow = '';
        }
    });
});