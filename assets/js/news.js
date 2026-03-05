document.addEventListener('DOMContentLoaded', async function() {
  // 1. Ініціалізація змінних
  const params = new URLSearchParams(window.location.search);
  const currentArticleId = params.get('id');
  const isNewsPage = window.location.pathname.includes('news.html');
  const isArticlePage = window.location.pathname.includes('article-template.html');

  // 2. Завантаження даних з JSON (який створює Decap CMS)
  let allNews = [];
  try {
      const response = await fetch('assets/data/news.json');
      allNews = await response.json();
      // Сортуємо від нових до старих
      allNews.sort((a, b) => new Date(b.date.split('.').reverse().join('-')) - new Date(a.date.split('.').reverse().join('-')));
  } catch (e) {
      console.error("Помилка завантаження новин:", e);
  }

  // --- ЛОГІКА СТОРІНКИ СПИСКУ НОВИН ---
  if (isNewsPage) {
      document.body.classList.add('news-page-active');
      const tabs = document.querySelectorAll('.news-tab');
      
      function renderGrid(filter = 'all') {
          const container = document.querySelector('.news-grid'); // Переконайся, що в news.html є цей клас
          if (!container) return;
          container.innerHTML = '';

          const filtered = allNews.filter(item => filter === 'all' || item.category === filter);

          filtered.forEach(item => {
              container.innerHTML += `
                  <article class="news-item is-shown" data-category="${item.category}">
                      <div class="news-card">
                          <img src="${item.image}" alt="${item.title}">
                          <time>${item.date}</time>
                          <h3>${item.title}</h3>
                          <p>${item.description}</p>
                          <a href="news/article-template.html?id=${item.id}">Детальніше</a>
                      </div>
                  </article>
              `;
          });
      }

      tabs.forEach(tab => {
          tab.addEventListener('click', (e) => {
              e.preventDefault();
              tabs.forEach(t => t.classList.remove('active'));
              tab.classList.add('active');
              renderGrid(tab.dataset.filter);
          });
      });

      // Початковий рендер
      const initialFilter = params.get('filter') || 'all';
      renderGrid(initialFilter);
  }

  // --- ЛОГІКА СТОРІНКИ КОНКРЕТНОЇ СТАТТІ ---
  if (isArticlePage && currentArticleId) {
      const articleIndex = allNews.findIndex(n => n.id === currentArticleId);
      const article = allNews[articleIndex];

      if (article) {
          // Наповнюємо контентом
          document.title = `${article.title} — Ферма`;
          document.getElementById('article-title').innerText = article.title;
          document.querySelector('.news-date').innerText = article.date;
          document.querySelector('.article-lead').innerText = article.description;
          document.querySelector('.article-hero-image').src = article.image;
          // Для тексту з Markdown (Decap видає Markdown)
          document.querySelector('.article-body-text').innerHTML = article.body; 

          // Кнопки навігації
          const prevLink = document.querySelector('.article-link--prev');
          const nextLink = document.querySelector('.article-link--next');

          if (articleIndex > 0) {
              nextLink.setAttribute('href', `news/article-template.html?id=${allNews[articleIndex-1].id}`);
          } else {
              nextLink.style.display = 'none';
          }

          if (articleIndex < allNews.length - 1) {
              prevLink.setAttribute('href', `news/article-template.html?id=${allNews[articleIndex+1].id}`);
          } else {
              prevLink.style.display = 'none';
          }
      }
  }
});