// IsulaFlix Profiles Page

(function () {
    console.log('Profiles script starting...');
    
    const html = document.documentElement;
    const profilesGrid = document.querySelector('.profiles-grid-large');
    const addProfileCard = document.querySelector('.add-profile-large');
    const manageBtn = document.getElementById('manageProfiles');
    
    console.log('Main elements found:');
    console.log('- profilesGrid:', profilesGrid);
    console.log('- addProfileCard:', addProfileCard);
    console.log('- manageBtn:', manageBtn);
    
    // Modal elements
    const createModal = document.getElementById('createProfileModal');
    const closeModalBtn = document.getElementById('closeCreateModal');
    const cancelBtn = document.getElementById('cancelCreateBtn');
    const createBtn = document.getElementById('createProfileBtn');
    const previewImg = document.getElementById('previewImg');
    const imagePreview = document.getElementById('profileImagePreview');
    const nameInput = document.getElementById('profileNameInput');
    const imageOptions = document.querySelectorAll('.image-option');
    
    console.log('Modal elements found:');
    console.log('- createModal:', createModal);
    console.log('- closeModalBtn:', closeModalBtn);
    console.log('- cancelBtn:', cancelBtn);
    console.log('- createBtn:', createBtn);
    console.log('- previewImg:', previewImg);
    console.log('- imagePreview:', imagePreview);
    console.log('- nameInput:', nameInput);
    console.log('- imageOptions:', imageOptions.length);

    // Theme system (same as main page)
    const THEMES = ['dark', 'light', 'sepia'];
    const STORAGE_KEY = 'isulaflix-theme';
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme && THEMES.includes(storedTheme)) {
        html.setAttribute('data-theme', storedTheme);
    }

    // Profile storage key
    const PROFILES_KEY = 'isulaflix-profiles';
    
    // Load profiles from localStorage
    function loadProfiles() {
        const profiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]');
        return profiles;
    }
    
    // Save profiles to localStorage
    function saveProfiles(profiles) {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }
    
    // Render profiles
    function renderProfiles() {
        const profiles = loadProfiles();
        console.log('Profiles loaded:', profiles);
        
        const existingCards = document.querySelectorAll('.profile-card-large:not(.add-profile-large)');
        console.log('Existing cards to remove:', existingCards.length);
        
        // Remove existing profile cards
        existingCards.forEach(card => card.remove());
        
        // Add profile cards
        profiles.forEach(profile => {
            const card = createProfileCard(profile);
            profilesGrid.insertBefore(card, addProfileCard);
        });
        
        console.log('Profiles rendered successfully');
    }
    
    // Create profile card element
    function createProfileCard(profile) {
        const card = document.createElement('div');
        card.className = 'profile-card-large';
        card.setAttribute('data-profile', profile.id);
        
        card.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}" class="profile-avatar-large">
            <h3 class="profile-name-large">${profile.name}</h3>
            <button class="profile-delete-btn" data-profile="${profile.id}" title="Supprimer le profil">×</button>
        `;
        
        // Add click handler for profile selection
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('profile-delete-btn')) {
                selectProfile(profile);
            }
        });
        
        return card;
    }
    
    // Select profile
    function selectProfile(profile) {
        localStorage.setItem('isulaflix-selected-profile', profile.name);
        localStorage.setItem('isulaflix-selected-profile-image', profile.image);
        window.location.href = 'index.html';
    }
    
    // Delete profile
    function deleteProfile(profileId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
            const profiles = loadProfiles();
            const updatedProfiles = profiles.filter(p => p.id !== profileId);
            saveProfiles(updatedProfiles);
            renderProfiles();
        }
    }
    
    // Show create profile modal
    function showCreateModal() {
        console.log('showCreateModal called');
        console.log('createModal element:', createModal);
        
        if (!createModal) {
            console.error('Create modal element not found!');
            return;
        }
        
        createModal.classList.add('active');
        createModal.setAttribute('aria-hidden', 'false');
        nameInput.value = '';
        previewImg.style.display = 'none';
        previewImg.src = '';
        imagePreview.querySelector('.image-placeholder').style.display = 'block';
        
        // Reset image selection
        imageOptions.forEach(option => option.classList.remove('selected'));
        
        nameInput.focus();
        
        console.log('Modal should be visible now');
    }
    
    // Hide create profile modal
    function hideCreateModal() {
        createModal.classList.remove('active');
        createModal.setAttribute('aria-hidden', 'true');
    }
    
    // Create new profile
    function createProfile() {
        console.log('Creating new profile...');
        const name = nameInput.value.trim();
        const image = previewImg.src;
        
        console.log('Name:', name);
        console.log('Image:', image);
        
        if (!name) {
            alert('Veuillez entrer un nom pour le profil');
            return;
        }
        
        if (!image) {
            alert('Veuillez choisir une image pour le profil');
            return;
        }
        
        const profiles = loadProfiles();
        const newProfile = {
            id: `profil${Date.now()}`,
            name: name,
            image: image
        };
        
        console.log('New profile:', newProfile);
        profiles.push(newProfile);
        saveProfiles(profiles);
        console.log('Profile saved, rendering...');
        renderProfiles();
        hideCreateModal();
    }
    

    // Event listeners
    if (addProfileCard) {
        console.log('Add profile card found, adding event listener');
        addProfileCard.addEventListener('click', (e) => {
            console.log('Add profile card clicked!');
            e.preventDefault();
            showCreateModal();
        });
    } else {
        console.log('Add profile card NOT found!');
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideCreateModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideCreateModal);
    }
    
    if (createBtn) {
        createBtn.addEventListener('click', createProfile);
    }
    
    // Image selection event listeners
    imageOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove selection from all options
            imageOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selection to clicked option
            option.classList.add('selected');
            
            // Update preview
            const imageSrc = option.getAttribute('data-image');
            previewImg.src = imageSrc;
            previewImg.style.display = 'block';
            imagePreview.querySelector('.image-placeholder').style.display = 'none';
            
            console.log('Image selected:', imageSrc);
        });
    });
    
    // Delete profile buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('profile-delete-btn')) {
            e.stopPropagation();
            const profileId = e.target.getAttribute('data-profile');
            deleteProfile(profileId);
        }
    });
    
    // Close modal on overlay click
    if (createModal) {
        createModal.addEventListener('click', (e) => {
            if (e.target === createModal) {
                hideCreateModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && createModal.style.display === 'flex') {
            hideCreateModal();
        }
    });
    
    // Enter key to create profile
    if (nameInput) {
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                createProfile();
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
    
    // Initialize default profiles if none exist
    function initializeDefaultProfiles() {
        const profiles = loadProfiles();
        if (profiles.length === 0) {
            const defaultProfiles = [
                {
                    id: 'profil1',
                    name: 'Profil 1',
                    image: 'assets/images/profils/Unknown-2.jpg'
                },
                {
                    id: 'profil2',
                    name: 'Profil 2',
                    image: 'assets/images/profils/Unknown-3.jpg'
                },
                {
                    id: 'profil3',
                    name: 'Profil 3',
                    image: 'assets/images/profils/Unknown-4.jpg'
                }
            ];
            saveProfiles(defaultProfiles);
        }
    }
    
    // Initialize profiles
    initializeDefaultProfiles();
    renderProfiles();

})();
