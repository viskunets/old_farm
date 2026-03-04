document.addEventListener('click', (e) => {
    // Універсальне відкриття модалок
    const openBtn = e.target.closest('.js-open-modal');
    if (openBtn) {
        e.preventDefault();
        // Отримуємо ID модалки з атрибута href (напр. #modal-support)
        const modalId = openBtn.getAttribute('href').replace('#', '');
        const modal = document.getElementById(modalId);
        
        if (modal) {
            modal.classList.remove('modal--success'); 
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            if (window.lenis) lenis.stop();
        }
    }

    // Універсальне закриття
    if (e.target.closest('.js-close-modal')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
            if (window.lenis) lenis.start();
        }
    }
});

// ФУНКЦІЯ КОПІЮВАННЯ КАРТКИ
window.copyToClipboard = function() {
    const copyText = document.getElementById("cardNumber");
    if (!copyText) return;

    navigator.clipboard.writeText(copyText.value).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        
        btn.textContent = "Скопійовано!";
        btn.style.background = "#A42C1E";
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = "";
        }, 2000);
    }).catch(err => {
        console.error('Помилка копіювання: ', err);
    });
};

// ОБРОБКА ФОРМИ (без змін)
document.addEventListener('submit', async function(e) {
    if (e.target && e.target.id === 'contact-form') {
        e.preventDefault();
        const form = e.target;
        const modal = form.closest('.modal');
        const submitBtn = form.querySelector('.modal__submit');
        const originalBtnText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Відправка...';

        try {
            const response = await fetch('https://formspree.io/f/xwvngrye', {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                modal.classList.add('modal--success');
                form.reset();
                setTimeout(() => {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    }, 500);
                }, 4000);
            } else { throw new Error(); }
        } catch (error) {
            alert('Помилка відправки.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }
});