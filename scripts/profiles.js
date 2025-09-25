// IsulaFlix Profiles Page

(function () {
    const html = document.documentElement;
    const profileCards = document.querySelectorAll('.profile-card-large:not(.add-profile-large)');
    const addProfileCard = document.querySelector('.add-profile-large');
    const manageBtn = document.getElementById('manageProfiles');

    // Theme system (same as main page)
    const THEMES = ['dark', 'light', 'sepia'];
    const STORAGE_KEY = 'isulaflix-theme';
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme && THEMES.includes(storedTheme)) {
        html.setAttribute('data-theme', storedTheme);
    }

    // Profile selection functionality
    profileCards.forEach(card => {
        card.addEventListener('click', () => {
            const profileName = card.querySelector('.profile-name-large').textContent;
            const profileImage = card.querySelector('.profile-avatar-large').src;
            
            // Store selected profile
            localStorage.setItem('isulaflix-selected-profile', profileName);
            localStorage.setItem('isulaflix-selected-profile-image', profileImage);
            
            // Redirect to main page
            window.location.href = 'index.html';
        });
    });

    // Add profile functionality
    if (addProfileCard) {
        addProfileCard.addEventListener('click', () => {
            const newProfileName = prompt('Nom du nouveau profil:');
            if (newProfileName && newProfileName.trim()) {
                // Create new profile card
                const newCard = document.createElement('div');
                newCard.className = 'profile-card-large';
                newCard.setAttribute('data-profile', `profil${Date.now()}`);
                newCard.innerHTML = `
                    <img src="assets/images/profils/Unknown-2.jpg" alt="${newProfileName}" class="profile-avatar-large">
                    <h3 class="profile-name-large">${newProfileName}</h3>
                `;
                
                // Insert before the add profile card
                addProfileCard.parentNode.insertBefore(newCard, addProfileCard);
                
                // Add click handler to new card
                newCard.addEventListener('click', () => {
                    const profileName = newCard.querySelector('.profile-name-large').textContent;
                    const profileImage = newCard.querySelector('.profile-avatar-large').src;
                    
                    localStorage.setItem('isulaflix-selected-profile', profileName);
                    localStorage.setItem('isulaflix-selected-profile-image', profileImage);
                    
                    window.location.href = 'index.html';
                });
            }
        });
    }

    // Manage profiles button
    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            alert('Fonctionnalité de gestion des profils à venir !');
        });
    }

    // Check if user already has a profile selected
    const selectedProfile = localStorage.getItem('isulaflix-selected-profile');
    if (selectedProfile && !window.location.search.includes('change=true')) {
        // User already has a profile, redirect to main page
        window.location.href = 'index.html';
    }

})();
