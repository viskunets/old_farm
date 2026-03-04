// assets/js/slider.js

function initSliders() {
    // --- Налаштування для БУЙВОЛІВ ---
    const buffaloImages = [
        'assets/images/4 1 (1).png', 
        'assets/images/buivo2.jpeg'
    ];
    setupSlider('buffalo-image1', 'prev-buffalo', 'next-buffalo', buffaloImages);

    // --- Налаштування для КОНЕЙ ---
    const horseImages = [
        'assets/images/11 1.png',
        'assets/images/horse2.jpg'
    ];
    setupSlider('horse-image', 'prev-horse', 'next-horse', horseImages);
}

// Універсальна функція для ініціалізації конкретного слайдера
function setupSlider(imgId, prevBtnId, nextBtnId, imagesArray) {
    const imgElement = document.getElementById(imgId);
    const btnPrev = document.getElementById(prevBtnId);
    const btnNext = document.getElementById(nextBtnId);

    // Перевіряємо, чи всі елементи є на сторінці
    if (!imgElement || !btnPrev || !btnNext) return;

    let currentIndex = 0;

    const updateImage = (index) => {
        // Додаємо невеликий ефект зникнення при зміні (опціонально)
        imgElement.style.opacity = '0.7';
        setTimeout(() => {
            imgElement.src = imagesArray[index];
            imgElement.style.opacity = '1';
        }, 150);
    };

    btnNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imagesArray.length;
        updateImage(currentIndex);
    });

    btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
        updateImage(currentIndex);
    });
}

// Запуск при завантаженні сторінки
document.addEventListener('DOMContentLoaded', initSliders);