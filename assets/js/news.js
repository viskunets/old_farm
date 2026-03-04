// Animated tabs + filter for news page
document.addEventListener('DOMContentLoaded', function(){
  // mark body so layout (sticky footer) applies only on news page
  if(document.querySelector('.news-page')) document.body.classList.add('news-page-active');
  const tabsContainer = document.querySelector('.news-tabs');
  const tabs = Array.from(document.querySelectorAll('.news-tab'));
  const items = Array.from(document.querySelectorAll('.news-item'));

  // create indicator
  const indicator = document.createElement('span');
  indicator.className = 'news-tab-indicator';
  if(tabsContainer) tabsContainer.appendChild(indicator);

  function updateIndicator(activeTab){
    if(!activeTab || !tabsContainer) return;
    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = tabsContainer.getBoundingClientRect();
    const offset = tabRect.left - containerRect.left;
    indicator.style.width = tabRect.width + 'px';
    indicator.style.transform = 'translateX(' + offset + 'px)';
  }

  const ITEMS_PER_PAGE = 8;
  let currentPage = 1;
  let filteredItems = items.slice();

  function renderPagination(totalPages){
    const container = document.querySelector('.news-pagination');
    if(!container) return;
    container.innerHTML = '';
    if(totalPages <= 1){ container.style.display = 'none'; return; }
    container.style.display = '';

    const prev = document.createElement('button');
    prev.className = 'page-btn page-prev';
    prev.textContent = '‹';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', ()=> showPage(Math.max(1, currentPage - 1)));
    container.appendChild(prev);

    for(let i=1;i<=totalPages;i++){
      const btn = document.createElement('button');
      btn.className = 'page-btn' + (i===currentPage ? ' active' : '');
      btn.dataset.page = i;
      btn.textContent = i;
      btn.addEventListener('click', ()=> showPage(i));
      container.appendChild(btn);
    }

    const next = document.createElement('button');
    next.className = 'page-btn page-next';
    next.textContent = '›';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', ()=> showPage(Math.min(totalPages, currentPage + 1)));
    container.appendChild(next);
  }

  function showPage(page){
    // show only items that are both in the filtered set and on the requested page
    currentPage = page;
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    items.forEach(item => {
      const idx = filteredItems.indexOf(item);
      if(idx !== -1 && idx >= start && idx < end){
        item.style.display = '';
        // force reflow then show with transition
        void item.offsetWidth;
        item.classList.add('is-shown');
      } else {
        item.classList.remove('is-shown');
        item.style.display = 'none';
      }
    });

    // update pagination buttons active state and prev/next disabled
    const activeBtn = document.querySelector('.page-btn.active');
    if(activeBtn) activeBtn.classList.remove('active');
    const btn = document.querySelector('.page-btn[data-page="' + page + '"]');
    if(btn) btn.classList.add('active');

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    const prev = document.querySelector('.page-prev');
    const next = document.querySelector('.page-next');
    if(prev) prev.disabled = page === 1;
    if(next) next.disabled = page === totalPages;

    // update URL page param without reloading
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    history.replaceState(null, '', url.toString());
  }

  function applyFilter(filter){
    // compute filtered set
    filteredItems = items.filter(item => (filter === 'all' || item.dataset.category === filter));
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    console.log('applyFilter', filter, 'matches', filteredItems.length, 'pages', totalPages);
    // keep current page if valid, otherwise reset to 1
    if(currentPage > totalPages) currentPage = 1;
    renderPagination(totalPages);
    showPage(currentPage);
  }

  // click handlers: filter in-place on news page, otherwise animate then navigate to news with filter param
  tabs.forEach(tab => tab.addEventListener('click', function(e){
    console.log('news-tab clicked', tab.dataset.filter);
    const href = tab.getAttribute('href') || ('/news.html?filter=' + tab.dataset.filter);
    const isNewsPage = window.location.pathname.includes('/news.html') || window.location.pathname.endsWith('/news');

    if(isNewsPage){
      e.preventDefault();
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      updateIndicator(tab);
      // always go to first page when changing filter
      currentPage = 1;
      applyFilter(tab.dataset.filter);

      // ensure page param resets
      const url = new URL(window.location);
      url.searchParams.set('filter', tab.dataset.filter);
      url.searchParams.set('page', 1);
      history.replaceState(null, '', url.toString());
    } else {
      // on article page: animate indicator then go to news with the requested filter
      e.preventDefault();
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      updateIndicator(tab);
      setTimeout(()=>{ window.location.href = href; }, 240);
    }
  }));

  // initial state: support ?filter=... and ?page=... on news page
  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get('filter');
  const initialPage = parseInt(params.get('page')) || 1;
  let active = document.querySelector('.news-tab.active') || tabs[0];
  if(initialFilter){
    const match = tabs.find(t => t.dataset.filter === initialFilter);
    if(match) active = match;
  }
  // set active tab and compute initial filtered set
  tabs.forEach(t=>t.classList.remove('active'));
  active.classList.add('active');
  currentPage = initialPage;
  applyFilter(active.dataset.filter || 'all');
  // position indicator after layout
  setTimeout(()=> updateIndicator(active), 10);

  // update indicator on resize
  window.addEventListener('resize', ()=> updateIndicator(document.querySelector('.news-tab.active')) );

  /* --- Article page: set prev/next links if present --- */
  (function(){
    // ordered list of article paths (update as more are created)
    const articleOrder = ['/news/ukrainer.html','/news/animals.html','/news/video-1.html'];
    const path = window.location.pathname;
    const idx = articleOrder.indexOf(path);
    if(idx === -1) return; // not an article we manage

    const prev = document.querySelector('.article-link--prev');
    const next = document.querySelector('.article-link--next');

    if(prev){
      if(idx > 0) prev.setAttribute('href', articleOrder[idx-1]);
      else prev.setAttribute('href','/news.html');
    }
    if(next){
      if(idx < articleOrder.length -1) next.setAttribute('href', articleOrder[idx+1]);
      else next.setAttribute('href','/news.html');
    }
  })();

});