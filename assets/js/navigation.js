function initNavigation() {
    const header = document.getElementById('header');
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    if (!header || !burgerBtn || !mobileMenu) {
        console.warn("Навігаційні елементи не знайдено");
        return;
    }

    const toggleMenu = (forceState = null) => {
        const isOpen = mobileMenu.classList.contains('is-open');
        const shouldOpen = forceState !== null ? forceState : !isOpen;

        if (shouldOpen) {
            mobileMenu.classList.add('is-open');
            burgerBtn.classList.add('is-active');
            body.classList.add('lock-scroll');
            burgerBtn.setAttribute('aria-expanded', 'true');
        } else {
            mobileMenu.classList.remove('is-open');
            burgerBtn.classList.remove('is-active');
            body.classList.remove('lock-scroll');
            burgerBtn.setAttribute('aria-expanded', 'false');
        }
    };

    // 🔥 ПЛАВНИЙ BURGER TOGGLE
    burgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Закриття при кліку на лінк
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Закриття при кліку поза меню
    document.addEventListener('click', (e) => {
        if (
            mobileMenu.classList.contains('is-open') &&
            !mobileMenu.contains(e.target) &&
            !burgerBtn.contains(e.target)
        ) {
            toggleMenu(false);
        }
    });

    // Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleMenu(false);
        }
    });

    // Scroll ефект
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}
