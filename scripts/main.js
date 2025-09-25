// StreamFlix interactions - Version corrigée

(function () {
    'use strict';
    
    console.log('StreamFlix script loading...');
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM ready, initializing...');
        console.log('Avatar button in DOM:', document.getElementById('discoverAvatarBtn'));
        initializeApp();
    });

    function initializeApp() {
    const html = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeMenu = document.getElementById('themeMenu');
    const navToggleBtn = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const yearEl = document.getElementById('year');
    const breadcrumb = document.getElementById('breadcrumb');
        const profileDisplay = document.getElementById('profileDisplay');
        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const changeProfileBtn = document.getElementById('changeProfile');
        
        // Search elements
        const searchToggle = document.getElementById('searchToggle');
        const searchBar = document.getElementById('searchBar');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        // Modal elements
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');
        const modalTitle = document.getElementById('modalTitle');
        const modalYear = document.getElementById('modalYear');
        const modalRating = document.getElementById('modalRating');
        const modalDuration = document.getElementById('modalDuration');
        const modalGenre = document.getElementById('modalGenre');
        const modalDescription = document.getElementById('modalDescription');
        const modalCast = document.getElementById('modalCast');
        const modalPoster = document.getElementById('modalPoster');
        const modalBackdrop = document.getElementById('modalBackdrop');
        const modalPlay = document.getElementById('modalPlay');
        const modalAdd = document.getElementById('modalAdd');
        const modalInfoBtn = document.getElementById('modalInfoBtn');

        console.log('Elements found:', {
            searchToggle: !!searchToggle,
            searchBar: !!searchBar,
            searchInput: !!searchInput,
            searchResults: !!searchResults,
            modalOverlay: !!modalOverlay,
            modalTitle: !!modalTitle
        });
  
    // Year in footer
    if (yearEl) yearEl.textContent = new Date().getFullYear();

        // Profile management
        function checkProfileSelection() {
            const selectedProfile = localStorage.getItem('isulaflix-selected-profile');
            const selectedProfileImage = localStorage.getItem('isulaflix-selected-profile-image');
            
            if (!selectedProfile) {
                // No profile selected, redirect to profiles page
                window.location.href = 'profiles.html';
                return;
            }
            
            // Display selected profile in header
            if (profileDisplay && profileAvatar && profileName) {
                profileAvatar.src = selectedProfileImage || 'assets/images/profils/Unknown-2.jpg';
                profileName.textContent = selectedProfile;
                profileDisplay.classList.remove('hidden');
            }
        }

        // Change profile button
        if (changeProfileBtn) {
            changeProfileBtn.addEventListener('click', () => {
                window.location.href = 'profiles.html?change=true';
            });
        }

        // Check profile on page load
        checkProfileSelection();

        // Search functionality
        let searchTimeout;
        let currentSearchResults = [];

        function toggleSearch() {
            console.log('Toggle search called');
            if (searchBar && searchInput) {
                searchBar.classList.toggle('active');
                if (searchBar.classList.contains('active')) {
                    searchInput.focus();
                    console.log('Search activated');
                } else {
                    searchInput.value = '';
                    hideSearchResults();
                    console.log('Search deactivated');
                }
            }
        }

        function hideSearchResults() {
            if (searchResults) {
                searchResults.classList.remove('active');
            }
        }

        function showSearchResults() {
            if (searchResults) {
                searchResults.classList.add('active');
            }
        }

        function performSearch(query) {
            console.log('Performing search for:', query);
            if (!query || query.length < 2) {
                hideSearchResults();
                return;
            }

            // Simple search with fallback results
            const mockResults = [
                { id: 1, title: `${query} - Film 1`, type: 'movie', poster_path: '/placeholder.jpg', release_date: '2024-01-01' },
                { id: 2, title: `${query} - Film 2`, type: 'movie', poster_path: '/placeholder.jpg', release_date: '2024-02-01' },
                { id: 3, title: `${query} - Série 1`, type: 'tv', poster_path: '/placeholder.jpg', first_air_date: '2024-01-15' },
                { id: 4, title: `${query} - Série 2`, type: 'tv', poster_path: '/placeholder.jpg', first_air_date: '2024-02-15' }
            ];

            currentSearchResults = mockResults;
            displaySearchResults(mockResults);
        }

        function formatYear(dateStr) {
            if (!dateStr) return '—';
            const d = new Date(dateStr);
            return Number.isNaN(d.getTime()) ? '—' : String(d.getFullYear());
        }

        function displaySearchResults(results) {
            if (!searchResults) return;

            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item">Aucun résultat trouvé</div>';
                showSearchResults();
                return;
            }

            searchResults.innerHTML = results.map(item => {
                const title = item.title || item.name || 'Sans titre';
                const year = formatYear(item.release_date || item.first_air_date);
                const poster = 'https://via.placeholder.com/92x138/333/fff?text=Poster';
                const type = item.type === 'movie' ? 'Film' : 'Série';

                return `
                    <div class="search-result-item" data-id="${item.id}" data-type="${item.type}">
                        <img src="${poster}" alt="${title}" class="search-result-poster">
                        <div class="search-result-info">
                            <div class="search-result-title">${title}</div>
                            <div class="search-result-meta">${year} • ${type}</div>
                        </div>
                    </div>
                `;
            }).join('');

            showSearchResults();
        }

        // Search event listeners
        if (searchToggle) {
            console.log('Adding search toggle listener');
            searchToggle.addEventListener('click', toggleSearch);
        } else {
            console.log('Search toggle NOT found');
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length >= 1) {
                    searchTimeout = setTimeout(() => {
                        // Redirect to search results page
                        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                    }, 500);
                } else {
                    hideSearchResults();
                }
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    toggleSearch();
                } else if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query.length >= 1) {
                        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                    }
                }
            });
        }

        // Search results click handler
        if (searchResults) {
            searchResults.addEventListener('click', (e) => {
                const resultItem = e.target.closest('.search-result-item');
                if (resultItem) {
                    const title = resultItem.querySelector('.search-result-title')?.textContent;
                    
                    if (title) {
                        showSimpleModal(title, resultItem);
                    }
                    toggleSearch();
                }
            });
        }

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (searchBar && !searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
                if (searchBar.classList.contains('active')) {
                    toggleSearch();
                }
            }
        });

        // Modal functionality
        async function showSimpleModal(title, card) {
            console.log('showSimpleModal called with:', title);
            console.log('Modal elements:', { modalOverlay: !!modalOverlay, modalTitle: !!modalTitle });
            console.log('Card parameter:', card);
            
            // Handle both DOM elements and data objects
            let imgSrc = '';
            let itemId = '';
            let itemData = null;
            
            if (card && typeof card.querySelector === 'function') {
                // It's a DOM element
                const img = card.querySelector('img');
                imgSrc = img?.src || '';
                itemId = card.dataset.itemId;
            } else if (card && typeof card === 'object') {
                // It's a data object (like Avatar data)
                imgSrc = card.poster_path ? `https://image.tmdb.org/t/p/w500${card.poster_path}` : '';
                itemId = card.id;
                itemData = card;
            }
            let item = itemData; // Use provided data if available
            
            // Try to find the item in current search results or loaded data
            if (!item && itemId) {
                // Look in all loaded data
                const allGrids = document.querySelectorAll('.grid.movies');
                for (const grid of allGrids) {
                    const items = Array.from(grid.children);
                    const foundItem = items.find(el => el.dataset.itemId === itemId);
                    if (foundItem) {
                        item = foundItem.dataset.itemData ? JSON.parse(foundItem.dataset.itemData) : null;
                        break;
                    }
                }
            }
            
            // Populate modal with basic info first
            if (modalTitle) modalTitle.textContent = title;
            if (modalYear) modalYear.textContent = 'Chargement...';
            if (modalRating) modalRating.textContent = 'Chargement...';
            if (modalDuration) modalDuration.textContent = 'Chargement...';
            if (modalGenre) modalGenre.textContent = 'Chargement...';
            if (modalDescription) modalDescription.textContent = 'Chargement des détails...';
            if (modalPoster) modalPoster.src = imgSrc;
            if (modalCast) modalCast.innerHTML = '<span class="cast-item">Chargement des acteurs...</span>';
            
            // Show modal immediately
            modalOverlay.classList.remove('hidden');
            modalOverlay.setAttribute('aria-hidden', 'false');
            
            // Fetch detailed information from TMDB if we have the item
            if (item && item.id) {
                try {
                    const isMovie = !!item.title;
                    const endpoint = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;
                    const creditsEndpoint = isMovie ? `/movie/${item.id}/credits` : `/tv/${item.id}/credits`;
                    
                    const [details, credits] = await Promise.all([
                        tmdb(endpoint),
                        tmdb(creditsEndpoint)
                    ]);

                    // Update modal with real data
                    if (modalYear) {
                        const year = formatYear(details.release_date || details.first_air_date);
                        modalYear.textContent = year;
                    }
                    
                    if (modalRating) {
                        const rating = typeof details.vote_average === 'number' ? (Math.round(details.vote_average * 10) / 10).toFixed(1) : '—';
                        modalRating.textContent = `${rating}/10`;
                    }
                    
                    if (modalDuration) {
                        const runtime = details.runtime || details.episode_run_time?.[0];
                        modalDuration.textContent = runtime ? `${runtime} min` : 'N/A';
                    }
                    
                    if (modalGenre) {
                        const genres = details.genres?.map(g => g.name).slice(0, 3).join(', ') || 'N/A';
                        modalGenre.textContent = genres;
                    }
                    
                    if (modalDescription) {
                        modalDescription.textContent = details.overview || 'Aucun résumé disponible.';
                    }
                    
                    if (modalCast) {
                        const cast = credits.cast?.slice(0, 5).map(actor => 
                            `<span class="cast-item">${actor.name}</span>`
                        ).join('') || '<span class="cast-item">Aucun acteur disponible</span>';
                        modalCast.innerHTML = cast;
                    }

                } catch (error) {
                    console.error('Error fetching details:', error);
                    // Keep default values if API fails
                    if (modalYear) modalYear.textContent = '2024';
                    if (modalRating) modalRating.textContent = '8.5 ⭐';
                    if (modalDuration) modalDuration.textContent = '120 min';
                    if (modalGenre) modalGenre.textContent = 'Action, Aventure';
                    if (modalDescription) modalDescription.textContent = `Découvrez "${title}", un contenu passionnant disponible sur IsulaFlix.`;
                    if (modalCast) modalCast.innerHTML = '<span class="cast-item">Acteurs principaux</span><span class="cast-item">Casting de qualité</span><span class="cast-item">Performance exceptionnelle</span>';
                }
            } else {
                // Fallback to basic info if no item data
                if (modalYear) modalYear.textContent = '2024';
                if (modalRating) modalRating.textContent = '8.5 ⭐';
                if (modalDuration) modalDuration.textContent = '120 min';
                if (modalGenre) modalGenre.textContent = 'Action, Aventure';
                if (modalDescription) modalDescription.textContent = `Découvrez "${title}", un contenu passionnant disponible sur IsulaFlix.`;
                if (modalCast) modalCast.innerHTML = '<span class="cast-item">Acteurs principaux</span><span class="cast-item">Casting de qualité</span><span class="cast-item">Performance exceptionnelle</span>';
            }

            // Set modal actions
            if (modalPlay) {
                modalPlay.onclick = () => {
                    alert(`Lancement de "${title}" - Fonctionnalité à venir !`);
                };
            }

            if (modalAdd) {
                const img = modalPoster?.src;
                const isInList = img && myList.includes(img);
                
                if (isInList) {
                    modalAdd.textContent = 'Supprimer de ma liste';
                    modalAdd.style.background = 'rgba(255, 0, 0, 0.1)';
                    modalAdd.style.borderColor = 'rgba(255, 0, 0, 0.3)';
                    modalAdd.style.color = '#ff4444';
                } else {
                    modalAdd.textContent = '+ Ma liste';
                    modalAdd.style.background = '';
                    modalAdd.style.borderColor = '';
                    modalAdd.style.color = '';
                }
                
                modalAdd.onclick = () => {
                    if (isInList) {
                        // Remove from list
                        const index = myList.indexOf(img);
                        if (index > -1) {
                            myList.splice(index, 1);
                            localStorage.setItem(LIST_KEY, JSON.stringify(myList));
                            renderList();
                            modalAdd.textContent = '✓ Supprimé';
                            setTimeout(() => {
                                modalAdd.textContent = '+ Ma liste';
                                modalAdd.style.background = '';
                                modalAdd.style.borderColor = '';
                                modalAdd.style.color = '';
                            }, 2000);
                        }
                    } else {
                        // Add to list
                        if (img && !myList.includes(img)) {
                            myList.push(img);
                            localStorage.setItem(LIST_KEY, JSON.stringify(myList));
                            renderList();
                            modalAdd.textContent = '✓ Ajouté';
                            setTimeout(() => {
                                modalAdd.textContent = 'Supprimer de ma liste';
                                modalAdd.style.background = 'rgba(255, 0, 0, 0.1)';
                                modalAdd.style.borderColor = 'rgba(255, 0, 0, 0.3)';
                                modalAdd.style.color = '#ff4444';
                            }, 2000);
                        }
                    }
                };
            }

            if (modalInfoBtn) {
                modalInfoBtn.onclick = () => {
                    alert(`Plus d'informations sur "${title}" - Fonctionnalité à venir !`);
                };
            }
            
            // Show modal
            if (modalOverlay) {
                console.log('Showing modal...');
                modalOverlay.classList.add('active');
                modalOverlay.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            } else {
                console.log('Modal overlay not found!');
            }
        }

        function closeModal() {
            if (modalOverlay) {
                modalOverlay.classList.remove('active');
                modalOverlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        }

        // Modal event listeners
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
                closeModal();
            }
        });

        // Add click handler to cards for modal - click anywhere on card
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            
            if (card) {
                e.preventDefault();
                // Get title from overlay or create a generic one
                const overlayTitle = card.querySelector('.overlay-title')?.textContent;
                const title = overlayTitle || 'Contenu IsulaFlix';
                console.log('Modal trigger:', title);
                
                showSimpleModal(title, card);
            }
        });
  
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
            
            console.log(`TMDB API call: ${url.toString()}`);
            
      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${TMDB.V4_TOKEN}`,
          Accept: 'application/json'
        }
      });
            
            if (!res.ok) {
                console.error(`TMDB API error: ${res.status} ${res.statusText}`);
                throw new Error(`TMDB ${res.status}`);
            }
            
            const data = await res.json();
            console.log(`TMDB API response for ${path}:`, data.results?.length || 0, 'items');
            return data;
    }

    function createMediaCard(item, index) {
      const isMovie = !!item.title;
      const title = item.title || item.name || 'Sans titre';
      const year = formatYear(item.release_date || item.first_air_date);
      const rating = typeof item.vote_average === 'number' ? (Math.round(item.vote_average * 10) / 10).toFixed(1) : '—';
      const poster = buildImage(item.poster_path, 'w342');
      const el = document.createElement('article');
      el.className = 'card';
            
            // Store item data in the card for modal access
            el.dataset.itemId = item.id;
            el.dataset.itemData = JSON.stringify(item);
            
      el.innerHTML = `
        <div class="card-media skeleton">
                    <img loading="lazy" alt="Poster: ${title}" src="${poster}" />
        </div>
        <div class="card-overlay" aria-hidden="true">
          <div class="overlay-center">
            <button class="play-btn" title="Lire" aria-label="Lire">▶</button>
          </div>
          <div class="overlay-bottom">
            <div class="overlay-title">${title}</div>
            <div class="overlay-meta">${year} • ${isMovie ? 'Film' : 'Série'} • ${rating}</div>
          </div>
        </div>`;
      const img = el.querySelector('img');
      img.addEventListener('load', () => el.querySelector('.card-media').classList.remove('skeleton'));
            img.addEventListener('error', () => {
                // Fallback image if the poster fails to load
                img.src = 'https://via.placeholder.com/342x513/333/fff?text=Poster';
                el.querySelector('.card-media').classList.remove('skeleton');
            });
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
            console.log('Loading data from TMDB API...');
      const seriesGrid = document.querySelector('#series .grid.movies');
      const filmsGrid = document.querySelector('#films .grid.movies');
      const newsGrid = document.querySelector('#nouveaux .grid.movies');

      try {
                console.log('Fetching trending TV, popular movies, and now playing...');
                // Fetch multiple pages for more content
        const [trendingTv, popularMovies, nowPlaying] = await Promise.all([
          tmdb('/trending/tv/day', { page: 1 }),
          tmdb('/movie/popular', { page: 1 }),
          tmdb('/movie/now_playing', { page: 1 })
        ]);
                
                // Fetch additional pages for more content
                const [trendingTv2, trendingTv3, popularMovies2, popularMovies3, nowPlaying2, nowPlaying3] = await Promise.all([
                    tmdb('/trending/tv/day', { page: 2 }),
                    tmdb('/trending/tv/day', { page: 3 }),
                    tmdb('/movie/popular', { page: 2 }),
                    tmdb('/movie/popular', { page: 3 }),
                    tmdb('/movie/now_playing', { page: 2 }),
                    tmdb('/movie/now_playing', { page: 3 })
                ]);
                
                // Combine results from multiple pages
                const combinedTrendingTv = {
                    ...trendingTv,
                    results: [...(trendingTv.results || []), ...(trendingTv2.results || []), ...(trendingTv3.results || [])]
                };
                
                const combinedPopularMovies = {
                    ...popularMovies,
                    results: [...(popularMovies.results || []), ...(popularMovies2.results || []), ...(popularMovies3.results || [])]
                };
                
                const combinedNowPlaying = {
                    ...nowPlaying,
                    results: [...(nowPlaying.results || []), ...(nowPlaying2.results || []), ...(nowPlaying3.results || [])]
                };
                
                console.log('TMDB data received:', {
                    trendingTv: combinedTrendingTv.results?.length || 0,
                    popularMovies: combinedPopularMovies.results?.length || 0,
                    nowPlaying: combinedNowPlaying.results?.length || 0
                });
                
                populateGrid(seriesGrid, combinedTrendingTv.results);
                populateGrid(filmsGrid, combinedPopularMovies.results);
                populateGrid(newsGrid, combinedNowPlaying.results);
                
                console.log('TMDB data loaded successfully!');
      } catch (err) {
        // Fallback: keep skeletons empty if API fails
        console.error('TMDB error:', err);
                console.log('Using fallback data...');
                
                // Load fallback data if API fails
                const fallbackData = generateFallbackData();
                populateGrid(seriesGrid, fallbackData.series);
                populateGrid(filmsGrid, fallbackData.movies);
                populateGrid(newsGrid, fallbackData.newReleases);
            }
        }
        
        function generateFallbackData() {
            return {
                series: [
                    { id: 66732, name: 'Stranger Things', poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', first_air_date: '2016-07-15', vote_average: 8.7 },
                    { id: 19885, name: 'Sherlock', poster_path: '/hA2ple9q4qnwxp3hKVNhroipsir.jpg', first_air_date: '2010-07-25', vote_average: 9.1 },
                    { id: 93405, name: 'Squid Game', poster_path: '/dDlEmu3EZ0Pgg93K2jNf50SFCVR.jpg', first_air_date: '2021-09-17', vote_average: 8.1 },
                    { id: 81356, name: 'Sex Education', poster_path: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', first_air_date: '2019-01-11', vote_average: 8.3 },
                    { id: 87108, name: 'Succession', poster_path: '/7r9lF4tJ5cHqFq3mQ1vYVfqQyQy.jpg', first_air_date: '2018-06-03', vote_average: 8.7 },
                    { id: 1399, name: 'Game of Thrones', poster_path: '/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg', first_air_date: '2011-04-17', vote_average: 8.5 },
                    { id: 94605, name: 'Arcane', poster_path: '/fqNWiZDrlgXh2uV8TQ9n3iJc4z.jpg', first_air_date: '2021-11-06', vote_average: 9.0 },
                    { id: 82856, name: 'The Mandalorian', poster_path: '/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg', first_air_date: '2019-11-12', vote_average: 8.5 },
                    { id: 82816, name: 'The Witcher', poster_path: '/7vjaCdMw15FEbXyLQTVa04URsPm.jpg', first_air_date: '2019-12-20', vote_average: 8.2 },
                    { id: 1402, name: 'The Walking Dead', poster_path: '/rqeYMLryjcawh2JeRpBUDnmNtVX.jpg', first_air_date: '2010-10-31', vote_average: 8.1 },
                    { id: 1396, name: 'Breaking Bad', poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', first_air_date: '2008-01-20', vote_average: 9.5 },
                    { id: 1398, name: 'The Office', poster_path: '/7DJKHzAiZ1qH3DJqFNfQH7S7f2.jpg', first_air_date: '2005-03-24', vote_average: 8.5 },
                    { id: 1408, name: 'House of Cards', poster_path: '/hKWxWjF7fT4z4hT1sV8vJ9Y4Q2.jpg', first_air_date: '2013-02-01', vote_average: 8.7 },
                    { id: 1418, name: 'The Big Bang Theory', poster_path: '/ooBGRQBdbGzBxAVfExiO8r7knoA.jpg', first_air_date: '2007-09-24', vote_average: 8.1 },
                    { id: 1416, name: 'The Simpsons', poster_path: '/9AKyspxVzywuaMu5xhFQZvjtYhn.jpg', first_air_date: '1989-12-17', vote_average: 8.7 }
                ],
                movies: [
                    { id: 603, title: 'The Matrix', poster_path: '/f89U3ADr1oiB1sKGExKx7mE0A7p.jpg', release_date: '1999-03-30', vote_average: 8.7 },
                    { id: 76341, title: 'Mad Max: Fury Road', poster_path: '/hA2ple9q4qnwxp3hKVNhroipsir.jpg', release_date: '2015-05-13', vote_average: 8.1 },
                    { id: 954, title: 'Mission: Impossible', poster_path: '/7r9lF4tJ5cHqFq3mQ1vYVfqQyQy.jpg', release_date: '1996-05-22', vote_average: 7.1 },
                    { id: 24428, title: 'The Avengers', poster_path: '/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', release_date: '2012-04-25', vote_average: 8.0 },
                    { id: 77, title: 'Memento', poster_path: '/fQMSaZOk7AjxX7BKVQDOf7JKryu.jpg', release_date: '2000-10-11', vote_average: 8.4 },
                    { id: 550, title: 'Fight Club', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', release_date: '1999-10-15', vote_average: 8.4 },
                    { id: 13, title: 'Forrest Gump', poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', release_date: '1994-06-23', vote_average: 8.5 },
                    { id: 680, title: 'Pulp Fiction', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', release_date: '1994-09-10', vote_average: 8.9 },
                    { id: 155, title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', release_date: '2008-07-16', vote_average: 9.0 },
                    { id: 238, title: 'The Godfather', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', release_date: '1972-03-14', vote_average: 9.2 },
                    { id: 424, title: 'Schindler\'s List', poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', release_date: '1993-11-30', vote_average: 8.9 },
                    { id: 389, title: '12 Angry Men', poster_path: '/ow3wq89wM8qd5X4hH6Mv8UqT7A1.jpg', release_date: '1957-04-10', vote_average: 9.0 },
                    { id: 278, title: 'The Shawshank Redemption', poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', release_date: '1994-09-23', vote_average: 9.3 },
                    { id: 372058, title: 'Your Name', poster_path: '/q719jXXEzOoYaps6babgKnONONX.jpg', release_date: '2016-08-26', vote_average: 8.2 },
                    { id: 496243, title: 'Parasite', poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', release_date: '2019-05-30', vote_average: 8.5 },
                    { id: 324857, title: 'Spider-Man: Into the Spider-Verse', poster_path: '/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg', release_date: '2018-12-06', vote_average: 8.4 },
                    { id: 299536, title: 'Avengers: Infinity War', poster_path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', release_date: '2018-04-25', vote_average: 8.4 },
                    { id: 299534, title: 'Avengers: Endgame', poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', release_date: '2019-04-24', vote_average: 8.4 },
                    { id: 181808, title: 'Star Wars: The Last Jedi', poster_path: '/kOVEVeg59E0wsnXmF9nrh6OmWII.jpg', release_date: '2017-12-13', vote_average: 6.9 },
                    { id: 181812, title: 'Star Wars: The Rise of Skywalker', poster_path: '/db32LaOibwEliAmSL2jjDF6oDdj.jpg', release_date: '2019-12-18', vote_average: 6.5 }
                ],
                newReleases: [
                    { id: 19995, title: 'Avatar', poster_path: '/kyeqWdyUXW608qlYkRqosgbbJyK.jpg', release_date: '2009-12-15', vote_average: 7.8 },
                    { id: 299534, title: 'Avengers: Endgame', poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', release_date: '2019-04-24', vote_average: 8.0 },
                    { id: 348, title: 'Alien', poster_path: '/2h00HrZs89SL3tXB4nb6MhXf0d.jpg', release_date: '1979-05-25', vote_average: 8.4 },
                    { id: 28, title: 'Apocalypse Now', poster_path: '/gQB8Y5R2bBGrlu5bJep7A7x26w.jpg', release_date: '1979-08-15', vote_average: 8.4 },
                    { id: 76600, title: 'Avatar: The Way of Water', poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', release_date: '2022-12-14', vote_average: 7.6 },
                    { id: 335983, title: 'Venom', poster_path: '/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg', release_date: '2018-09-28', vote_average: 5.9 },
                    { id: 335984, title: 'Venom: Let There Be Carnage', poster_path: '/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg', release_date: '2021-09-30', vote_average: 5.9 },
                    { id: 335787, title: 'Uncharted', poster_path: '/rJHC1RUORuUhtfNb4Npclx0xnOf.jpg', release_date: '2022-02-10', vote_average: 6.3 },
                    { id: 335988, title: 'The Batman', poster_path: '/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg', release_date: '2022-03-01', vote_average: 7.8 },
                    { id: 335985, title: 'Black Widow', poster_path: '/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg', release_date: '2021-07-07', vote_average: 6.7 },
                    { id: 335986, title: 'Shang-Chi and the Legend of the Ten Rings', poster_path: '/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg', release_date: '2021-09-01', vote_average: 7.4 },
                    { id: 335987, title: 'Eternals', poster_path: '/6AdXwFTRTAzggD2QUTt5B7JFGKL.jpg', release_date: '2021-11-03', vote_average: 6.3 },
                    { id: 335989, title: 'Spider-Man: No Way Home', poster_path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', release_date: '2021-12-15', vote_average: 8.2 },
                    { id: 335990, title: 'Doctor Strange in the Multiverse of Madness', poster_path: '/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', release_date: '2022-05-04', vote_average: 6.9 },
                    { id: 335991, title: 'Thor: Love and Thunder', poster_path: '/pIkRyD18kl0Ff0mOPR7r2dFfK9I.jpg', release_date: '2022-07-06', vote_average: 6.2 },
                    { id: 335992, title: 'Black Panther: Wakanda Forever', poster_path: '/ps2oKfhY6DL3alnuLEVKj2Rfzuv.jpg', release_date: '2022-11-09', vote_average: 7.3 },
                    { id: 335993, title: 'Ant-Man and the Wasp: Quantumania', poster_path: '/ngl2FBlHIfE6kGTrf9sK0b5u0tP.jpg', release_date: '2023-02-15', vote_average: 6.1 },
                    { id: 335994, title: 'Guardians of the Galaxy Vol. 3', poster_path: '/5YZbUmjbMa3ClvSW1W7mG0PisSy.jpg', release_date: '2023-05-03', vote_average: 8.0 },
                    { id: 335995, title: 'The Flash', poster_path: '/rktDFPbfHfUbArZ6RDOKnmsmOQ3.jpg', release_date: '2023-06-14', vote_average: 6.8 },
                    { id: 335996, title: 'Indiana Jones and the Dial of Destiny', poster_path: '/Af4bXE63pVsb2FtbK8iWNn2n4z6.jpg', release_date: '2023-06-28', vote_average: 6.6 }
                ]
            };
        }

    // Staggered fade-in animation via JS-created keyframes
    const style = document.createElement('style');
    style.textContent = `@keyframes fade-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }`;
    document.head.appendChild(style);
  
    // Load real data from TMDB
    loadFromTMDB();

        // Carousel functionality
        initializeCarousels();
        
        // Initialize list actions
        initializeListActions();
        
        // Initialize Avatar button with a small delay to ensure DOM is fully ready
        setTimeout(() => {
            initializeAvatarButton();
        }, 100);
        
        // Initialize scroll to new button
        initializeScrollToNewButton();
        
        // Also add a global click handler as backup
        document.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'discoverAvatarBtn') {
                console.log('Avatar button clicked via global handler!');
                e.preventDefault();
                showAvatarModal();
            }
        });
  
    // Simple user list: persist added items in localStorage
    const LIST_KEY = 'streamflix-list';
    let myList = JSON.parse(localStorage.getItem(LIST_KEY) || '[]');
    const listGrid = document.querySelector('[data-user-list]');
    function renderList() {
      if (!listGrid) return;
      listGrid.innerHTML = '';
            const listActions = document.getElementById('listActions');
            
            if (myList.length === 0) {
                listGrid.innerHTML = '<p class="empty-list">Aucun élément dans votre liste</p>';
                if (listActions) listActions.style.display = 'none';
                return;
            }
            
            // Show clear button when list has items
            if (listActions) listActions.style.display = 'block';
            
      myList.forEach((src, i) => {
        const item = { title: `Ma liste ${i + 1}`, poster_path: null };
        const card = createMediaCard(item, i);
        card.querySelector('img').src = src;
        listGrid.appendChild(card);
      });
    }
        renderList();

        // Carousel initialization
        function initializeCarousels() {
            const carousels = document.querySelectorAll('[data-carousel]');
            
            carousels.forEach(carousel => {
                const carouselId = carousel.dataset.carousel;
                const prevBtn = document.querySelector(`[data-target="${carouselId}"].carousel-prev`);
                const nextBtn = document.querySelector(`[data-target="${carouselId}"].carousel-next`);
                
                if (prevBtn && nextBtn) {
                    // Scroll amount (width of 2 cards + gaps)
                    const scrollAmount = (250 + 16) * 2; // card width + gap * 2
                    
                    let autoScrollInterval;
                    let isUserInteracting = false;
                    
                    // Auto-scroll function
                    const startAutoScroll = () => {
                        if (autoScrollInterval) clearInterval(autoScrollInterval);
                        
                        autoScrollInterval = setInterval(() => {
                            if (!isUserInteracting) {
                                const isAtEnd = carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 10);
                                
                                if (isAtEnd) {
                                    // Reset to beginning
                                    carousel.scrollTo({
                                        left: 0,
                                        behavior: 'smooth'
                                    });
                                } else {
                                    // Scroll forward
                                    carousel.scrollBy({
                                        left: scrollAmount,
                                        behavior: 'smooth'
                                    });
                                }
                                updateButtons();
                            }
                        }, 3000); // Auto-scroll every 3 seconds
                    };
                    
                    // Manual scroll functions
                    prevBtn.addEventListener('click', () => {
                        isUserInteracting = true;
                        carousel.scrollBy({
                            left: -scrollAmount,
                            behavior: 'smooth'
                        });
                        setTimeout(() => { isUserInteracting = false; }, 2000);
                    });
                    
                    nextBtn.addEventListener('click', () => {
                        isUserInteracting = true;
                        carousel.scrollBy({
                            left: scrollAmount,
                            behavior: 'smooth'
                        });
                        setTimeout(() => { isUserInteracting = false; }, 2000);
                    });
                    
                    // Update button states based on scroll position
                    const updateButtons = () => {
                        const isAtStart = carousel.scrollLeft <= 0;
                        const isAtEnd = carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth);
                        
                        prevBtn.disabled = isAtStart;
                        nextBtn.disabled = isAtEnd;
                    };
                    
                    // Pause auto-scroll on hover
                    carousel.addEventListener('mouseenter', () => {
                        isUserInteracting = true;
                        if (autoScrollInterval) clearInterval(autoScrollInterval);
                    });
                    
                    carousel.addEventListener('mouseleave', () => {
                        setTimeout(() => { isUserInteracting = false; }, 1000);
                        startAutoScroll();
                    });
                    
                    // Initial state
                    updateButtons();
                    
                    // Update on scroll
                    carousel.addEventListener('scroll', updateButtons);
                    
                    // Update on resize
                    window.addEventListener('resize', updateButtons);
                    
                    // Start auto-scroll
                    startAutoScroll();
                }
                
                // Mouse wheel horizontal scroll
                carousel.addEventListener('wheel', (e) => {
                    // Check if it's a horizontal scroll (Shift held) or if deltaX is significant
                    const isHorizontalScroll = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
                    
                    if (isHorizontalScroll) {
                        e.preventDefault();
                        isUserInteracting = true;
                        carousel.scrollLeft += (e.deltaX || e.deltaY) * 2;
                        setTimeout(() => { isUserInteracting = false; }, 2000);
                    } else if (e.deltaY !== 0) {
                        // For vertical scroll, only prevent if we're not at the scroll boundaries
                        const isAtTop = window.scrollY <= 0;
                        const isAtBottom = window.scrollY >= (document.documentElement.scrollHeight - window.innerHeight);
                        
                        // Only prevent vertical scroll if we're at boundaries and trying to scroll further
                        if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                            e.preventDefault();
                            isUserInteracting = true;
                            carousel.scrollLeft += e.deltaY * 2;
                            setTimeout(() => { isUserInteracting = false; }, 2000);
                        }
                    }
                });
            });
        }
        
        function initializeListActions() {
            const clearListBtn = document.getElementById('clearListBtn');
            const listActions = document.getElementById('listActions');
            
            if (clearListBtn && listActions) {
                clearListBtn.addEventListener('click', () => {
                    if (confirm('Êtes-vous sûr de vouloir vider votre liste ?')) {
                        myList = [];
                        localStorage.setItem(LIST_KEY, JSON.stringify(myList));
    renderList();
                        listActions.style.display = 'none';
                    }
                });
            }
        }

        function initializeAvatarButton() {
            console.log('Initializing Avatar button...');
            const discoverAvatarBtn = document.getElementById('discoverAvatarBtn');
            console.log('Avatar button element:', discoverAvatarBtn);
            
            if (discoverAvatarBtn) {
                console.log('Avatar button found, adding event listener');
                discoverAvatarBtn.addEventListener('click', (e) => {
                    console.log('Avatar button clicked!');
                    e.preventDefault();
                    showAvatarModal();
                });
            } else {
                console.error('Avatar button NOT found! Trying again in 500ms...');
                // Try again after a delay
                setTimeout(() => {
                    const retryBtn = document.getElementById('discoverAvatarBtn');
                    if (retryBtn) {
                        console.log('Avatar button found on retry, adding event listener');
                        retryBtn.addEventListener('click', (e) => {
                            console.log('Avatar button clicked!');
                            e.preventDefault();
                            showAvatarModal();
                        });
                    } else {
                        console.error('Avatar button still not found after retry');
                    }
                }, 500);
            }
        }

        function initializeScrollToNewButton() {
            const scrollToNewBtn = document.getElementById('scrollToNewBtn');
            
            if (scrollToNewBtn) {
                scrollToNewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    scrollToSection('nouveaux');
                });
            }
        }

        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                // Smooth scroll to the section with offset for header
                const headerHeight = 80; // Approximate header height
                const sectionTop = section.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });
                
                console.log(`Scrolled to section: ${sectionId}`);
            } else {
                console.error(`Section not found: ${sectionId}`);
            }
        }

        async function showAvatarModal() {
            console.log('showAvatarModal function called!');
            console.log('Loading Avatar data...');
            
            try {
                // Avatar 3 movie ID from TMDB (assuming it exists or using Avatar 2 as fallback)
                const avatarId = 76600; // Avatar: The Way of Water ID as fallback
                
                // Fetch movie details
                const movieData = await tmdb(`/movie/${avatarId}`);
                console.log('Avatar movie data:', movieData);
                
                // Fetch cast
                const castData = await tmdb(`/movie/${avatarId}/credits`);
                console.log('Avatar cast data:', castData);
                
                // Create Avatar item object
                const avatarItem = {
                    id: movieData.id,
                    title: movieData.title,
                    overview: movieData.overview,
                    poster_path: movieData.poster_path,
                    backdrop_path: movieData.backdrop_path,
                    release_date: movieData.release_date,
                    vote_average: movieData.vote_average,
                    runtime: movieData.runtime,
                    genres: movieData.genres,
                    cast: castData.cast.slice(0, 5), // Top 5 cast members
                    isMovie: true
                };
                
                // Show modal with Avatar data
                showSimpleModal(avatarItem.title, avatarItem);
                
            } catch (error) {
                console.error('Error loading Avatar data:', error);
                
                // Fallback with basic Avatar info
                const fallbackAvatar = {
                    id: 'avatar-fallback',
                    title: 'Avatar 3 : De Feu et de Cendres',
                    overview: 'La suite épique de la saga Avatar. Jake Sully et sa famille continuent leur combat pour protéger Pandora contre les menaces humaines. Une nouvelle aventure spectaculaire vous attend dans ce monde fantastique.',
                    poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', // Avatar 2 poster
                    backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
                    release_date: '2025-12-19',
                    vote_average: 8.5,
                    runtime: 192,
                    genres: [
                        { name: 'Science-Fiction' },
                        { name: 'Aventure' },
                        { name: 'Fantasy' }
                    ],
                    cast: [
                        { name: 'Sam Worthington' },
                        { name: 'Zoe Saldana' },
                        { name: 'Sigourney Weaver' },
                        { name: 'Stephen Lang' },
                        { name: 'Kate Winslet' }
                    ],
                    isMovie: true
                };
                
                showSimpleModal(fallbackAvatar.title, fallbackAvatar);
            }
        }

        console.log('StreamFlix initialized successfully!');
    }
  })();
  