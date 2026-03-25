document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sideNav = document.getElementById('side-nav');
    const overlay = document.getElementById('overlay');
    const mainContent = document.getElementById('main-content');
    const openSujetsLink = document.getElementById('open-sujets');


    const openMenu = () => {
        sideNav.classList.add('is-open');
        overlay.classList.add('is-active');
    };

    // Ouvrir le menu "Sujets" depuis le header
    if (openSujetsLink) {
        openSujetsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (sideNav.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    const closeMenu = () => {
        sideNav.classList.remove('is-open');
        overlay.classList.remove('is-active');
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
    });

    overlay.addEventListener('click', closeMenu);
    

    const navLinks = sideNav.querySelectorAll('.nav-list a');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            
            if (!href || href === '#') {
                console.warn('Lien de navigation invalide.');
                return;
            }

            loadContent(href);
        });
    });

    const loadContent = (url) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                const newContent = doc.body.innerHTML;

                if (newContent) {
                    mainContent.innerHTML = newContent;
                } else {
                    mainContent.innerHTML = '<p class="text-center">Le contenu n\'a pas pu être chargé. Veuillez réessayer.</p>';
                    console.error(`Aucun élément 'body' trouvé dans ${url}`);
                }
                closeMenu();
                
                window.scrollTo(0, 0);
                
                // Ré-attacher les event listeners après le chargement
                attachEventListeners();
            })
            .catch(error => {
                console.error('Erreur lors du chargement de la page:', error);
                mainContent.innerHTML = `<p class="text-center">Une erreur est survenue. Impossible de charger le contenu de la page : ${url}.</p>`;
                closeMenu();
            });
    };
    
    // Fonction pour attacher les event listeners aux éléments dynamiques
    const attachEventListeners = () => {
        // Ré-attacher l'event listener pour le bouton "Sujets" dans le header
        const newOpenSujetsLink = document.getElementById('open-sujets');
        if (newOpenSujetsLink) {
            newOpenSujetsLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (sideNav.classList.contains('is-open')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });
        }
        
        // Ré-attacher les event listeners pour les liens de navigation dans le side nav
        const newNavLinks = sideNav.querySelectorAll('.nav-list a');
        newNavLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const href = link.getAttribute('href');
                
                if (!href || href === '#') {
                    console.warn('Lien de navigation invalide.');
                    return;
                }

                loadContent(href);
            });
        });
    };
    
    // Attacher les event listeners initiaux
    attachEventListeners();
});
