// 1. Ініціалізація Lenis (робимо його глобальним)
window.lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  window.lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Функція для завантаження header/footer та ініціалізації кнопки скролу
async function loadIncludes() {
  const nodes = document.querySelectorAll("[data-include]");

  await Promise.all(
    Array.from(nodes).map(async (node) => {
      const url = node.getAttribute("data-include");
      if (!url) return;

      try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(`Failed to load ${url}`);
        const html = await res.text();
        node.innerHTML = html;
      } catch (e) {
        console.error(e);
      }
    })
  );

  // Після того, як контент завантажено, ініціалізуємо навігацію та кнопку
  if (typeof initNavigation === "function") {
    initNavigation();
  }
  
  // Запускаємо ініціалізацію кнопки скролу
  initScrollButton();
}

// 3. Логіка плавної прокрутки для кнопки
function initScrollButton() {
  const scrollBtn = document.querySelector('.scroll-btn');
  
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement && window.lenis) {
        // Використовуємо саме Lenis для скролу
        window.lenis.scrollTo(targetElement, {
          offset: -120, // Відступ для кращого позиціювання
          duration: 1.5,
          immediate: false
        });
      }
    });
  }
}

// Запуск при завантаженні сторінки
document.addEventListener("DOMContentLoaded", loadIncludes);