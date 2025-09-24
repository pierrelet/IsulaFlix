// StreamFlix interactions

(function () {
    const html = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeMenu = document.getElementById('themeMenu');
    const navToggleBtn = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const yearEl = document.getElementById('year');
    const breadcrumb = document.getElementById('breadcrumb');
  
    // Year in footer
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  
    // Theme system with localStorage
    const THEMES = ['dark', 'light', 'sepia'];
    const STORAGE_KEY = 'streamflix-theme';
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme && THEMES.includes(storedTheme)) {
      html.setAttribute('data-theme', storedTheme);
    }
  
    function applyTheme(theme) {
      if (!THEMES.includes(theme)) return;
      html.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
      updateThemeMenu(theme);
    }
    function updateThemeMenu(current) {
      if (!themeMenu) return;
      themeMenu.querySelectorAll('li').forEach(li => li.setAttribute('aria-selected', String(li.dataset.theme === current)));
    }
    function toggleThemeMenu() {
      if (!themeMenu || !themeToggleBtn) return;
      const isHidden = themeMenu.classList.toggle('hidden');
      themeToggleBtn.setAttribute('aria-expanded', String(!isHidden));
    }
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleThemeMenu);
      document.addEventListener('click', (e) => {
        if (!themeMenu || !themeToggleBtn) return;
        if (!themeMenu.contains(e.target) && e.target !== themeToggleBtn) {
          themeMenu.classList.add('hidden');
          themeToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
      if (themeMenu) {
        themeMenu.addEventListener('click', (e) => {
          const li = e.target.closest('li');
          if (!li) return;
          applyTheme(li.dataset.theme);
          themeMenu.classList.add('hidden');
          themeToggleBtn.setAttribute('aria-expanded', 'false');
        });
        updateThemeMenu(html.getAttribute('data-theme') || 'dark');
      }
    }
  
    // Mobile nav toggle
    if (navToggleBtn && navMenu) {
      navToggleBtn.addEventListener('click', () => {
        const expanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
        navToggleBtn.setAttribute('aria-expanded', String(!expanded));
        navMenu.classList.toggle('hidden');
      });
    }
  
    // Animated nav indicator follows active link
    const navIndicator = document.querySelector('.nav-indicator');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    function updateIndicator(targetEl) {
      if (!navIndicator || !targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const parentRect = targetEl.parentElement.getBoundingClientRect();
      navIndicator.style.left = rect.left - parentRect.left + 'px';
      navIndicator.style.width = rect.width + 'px';
    }
    function setActive(link) {
      navLinks.forEach(l => l.classList.toggle('is-active', l === link));
      updateIndicator(link);
    }
    window.addEventListener('resize', () => {
      const active = document.querySelector('.nav-link.is-active');
      if (active) updateIndicator(active);
    });
    navLinks.forEach(link => link.addEventListener('click', (e) => {
      setActive(e.currentTarget);
    }));
    // Initial indicator
    window.requestAnimationFrame(() => {
      const active = document.querySelector('.nav-link.is-active');
      if (active) updateIndicator(active);
    });
  
    // Header shrink on scroll
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      document.body.classList.toggle('is-compact', y > 24 && y > lastY);
      lastY = y;
    }, { passive: true });
  
    // Scrollspy with IntersectionObserver
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const idToLink = new Map(navLinks.map(l => [l.getAttribute('href').slice(1), l]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const link = idToLink.get(id);
          if (link) setActive(link);
          updateBreadcrumb(entry.target);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    sections.forEach(s => observer.observe(s));
  
    function updateBreadcrumb(section) {
      if (!breadcrumb) return;
      const title = section.getAttribute('data-title') || section.id;
      breadcrumb.innerHTML = '';
      const items = [
        { label: 'Accueil', href: '#home' },
        { label: title, href: `#${section.id}` }
      ];
      items.forEach((item, idx) => {
        const li = document.createElement('li');
        if (idx > 0) {
          const sep = document.createElement('li'); sep.className = 'sep'; sep.textContent = '›'; breadcrumb.appendChild(sep);
        }
        const a = document.createElement('a'); a.href = item.href; a.textContent = item.label; li.appendChild(a);
        breadcrumb.appendChild(li);
      });
    }
  
    // Hero parallax via mouse and scroll
    const hero = document.querySelector('.hero');
    const layers = {
      back: document.querySelector('.layer-back'),
      mid: document.querySelector('.layer-mid'),
      front: document.querySelector('.layer-front'),
    };
    function parallax(xRatio, yRatio) {
      if (layers.back) layers.back.style.transform = `translate3d(${xRatio * -8}px, ${yRatio * -4}px, -80px) scale(1.1)`;
      if (layers.mid) layers.mid.style.transform = `translate3d(${xRatio * -16}px, ${yRatio * -8}px, -40px) scale(1.05)`;
      if (layers.front) layers.front.style.transform = `translate3d(${xRatio * 10}px, ${yRatio * 6}px, 0)`;
    }
    if (hero) {
      hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        parallax(x * 20, y * 20);
      });
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const xRatio = 0;
        const yRatio = Math.max(0, 1 - Math.min(1, y / 600)) * -10;
        parallax(xRatio, yRatio);
      }, { passive: true });
    }
  
    // =====================
    // TMDB Client & rendering
    // =====================
    const TMDB = {
      API_KEY: 'e4b90327227c88daac14c0bd0c1f93cd',
      BASE_URL: 'https://api.themoviedb.org/3',
      IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
      V4_TOKEN: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGI5MDMyNzIyN2M4OGRhYWMxNGMwYmQwYzFmOTNjZCIsIm5iZiI6MTc1ODY0ODMyMS43NDg5OTk4LCJzdWIiOiI2OGQyZDgwMTJhNWU3YzBhNDVjZWNmZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.aylEitwtAH0w4XRk8izJNNkF_bet8sxiC9iI-zSdHbU'
    };

    const FALLBACK_IMAGES = [
      'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?q=80&w=800&auto=format&fit=crop'
    ];

    function buildImage(path, size) {
      const s = size || 'w342';
      if (!path) return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      return `${TMDB.IMAGE_BASE_URL}/${s}${path}`;
    }

    async function tmdb(path, params) {
      const url = new URL(`${TMDB.BASE_URL}${path}`);
      const defaultParams = { language: 'fr-FR', include_adult: 'false' };
      const qp = { ...(params || {}), ...defaultParams };
      Object.entries(qp).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
      });
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${TMDB.V4_TOKEN}`,
          Accept: 'application/json'
        }
      });
      if (!res.ok) throw new Error(`TMDB ${res.status}`);
      return res.json();
    }

    function formatYear(dateStr) {
      if (!dateStr) return '—';
      const d = new Date(dateStr);
      return Number.isNaN(d.getTime()) ? '—' : String(d.getFullYear());
    }

    function createMediaCard(item, index) {
      const isMovie = !!item.title;
      const title = item.title || item.name || 'Sans titre';
      const year = formatYear(item.release_date || item.first_air_date);
      const rating = typeof item.vote_average === 'number' ? (Math.round(item.vote_average * 10) / 10).toFixed(1) : '—';
      const poster = buildImage(item.poster_path, 'w342');
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <div class="card-media skeleton">
          <picture>
            <source media="(min-width: 1024px)" srcset="${buildImage(item.poster_path, 'w780')} 2x" />
            <img loading="lazy" alt="Poster: ${title}" />
          </picture>
        </div>
        <div class="card-overlay" aria-hidden="true">
          <div class="overlay-center">
            <button class="play-btn" title="Lire" aria-label="Lire">▶</button>
          </div>
          <div class="overlay-bottom">
            <div class="overlay-title">${title}</div>
            <div class="overlay-meta">${year} • ${isMovie ? 'Film' : 'Série'} • ${rating}</div>
          </div>
        </div>
        <span class="badge">TOP ${((index % 10) + 1)}</span>
        <div class="card-actions">
          <button class="icon-btn" title="Ajouter à ma liste" data-action="add">+</nbutton>
          <button class="icon-btn" title="Voir les détails" data-action="info">i</button>
        </div>
        <div class="card-info">
          <h3 class="card-title">${title}</h3>
          <p class="card-meta">${year} • ${isMovie ? 'Film' : 'Série'} • ${rating}</p>
        </div>`;
      const img = el.querySelector('img');
      img.addEventListener('load', () => el.querySelector('.card-media').classList.remove('skeleton'));
      img.src = poster;
      return el;
    }

    function populateGrid(grid, items) {
      if (!grid) return;
      grid.innerHTML = '';
      (items || []).slice(0, 18).forEach((item, i) => {
        const card = createMediaCard(item, i);
        card.style.animation = `fade-in var(--dur-3) var(--ease-smooth) ${i * 40}ms both`;
        grid.appendChild(card);
      });
    }

    async function loadFromTMDB() {
      const seriesGrid = document.querySelector('#series .grid.movies');
      const filmsGrid = document.querySelector('#films .grid.movies');
      const newsGrid = document.querySelector('#nouveaux .grid.movies');

      try {
        const [trendingTv, popularMovies, nowPlaying] = await Promise.all([
          tmdb('/trending/tv/day', { page: 1 }),
          tmdb('/movie/popular', { page: 1 }),
          tmdb('/movie/now_playing', { page: 1 })
        ]);
        populateGrid(seriesGrid, trendingTv.results);
        populateGrid(filmsGrid, popularMovies.results);
        populateGrid(newsGrid, nowPlaying.results);
      } catch (err) {
        // Fallback: keep skeletons empty if API fails
        console.error('TMDB error:', err);
      }
    }

    // Staggered fade-in animation via JS-created keyframes
    const style = document.createElement('style');
    style.textContent = `@keyframes fade-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }`;
    document.head.appendChild(style);
  
    // Load real data from TMDB
    loadFromTMDB();
  
    // Simple user list: persist added items in localStorage
    const LIST_KEY = 'streamflix-list';
    let myList = JSON.parse(localStorage.getItem(LIST_KEY) || '[]');
    const listGrid = document.querySelector('[data-user-list]');
    function renderList() {
      if (!listGrid) return;
      listGrid.innerHTML = '';
      myList.forEach((src, i) => {
        const item = { title: `Ma liste ${i + 1}`, poster_path: null };
        const card = createMediaCard(item, i);
        card.querySelector('img').src = src;
        listGrid.appendChild(card);
      });
    }
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.icon-btn[data-action="add"]');
      if (!btn) return;
      const card = btn.closest('.card');
      const img = card && card.querySelector('img');
      if (!img) return;
      const src = img.currentSrc || img.src;
      if (!myList.includes(src)) {
        myList.push(src);
        localStorage.setItem(LIST_KEY, JSON.stringify(myList));
        renderList();
      }
    });
    renderList();
  })();
  
  
  