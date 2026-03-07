document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sideNav = document.getElementById('side-nav');
    const overlay = document.getElementById('overlay');
    const mainContent = document.getElementById('main-content');

    // --- Gestion de l'ouverture/fermeture du volet ---

    const openMenu = () => {
        sideNav.classList.add('is-open');
        overlay.classList.add('is-active');
    };

    const closeMenu = () => {
        sideNav.classList.remove('is-open');
        overlay.classList.remove('is-active');
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
    });

    overlay.addEventListener('click', closeMenu);
    
    // --- Gestion du chargement de contenu ---

    const navLinks = sideNav.querySelectorAll('.nav-list a');

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Empêche la navigation standard
            const href = link.getAttribute('href');
            
            // Si le lien est invalide, ne rien faire
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
                // Utilise DOMParser pour analyser le HTML reçu
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Cherche le contenu principal dans la page chargée.
                // On peut cibler une balise <main> ou un conteneur spécifique comme #content
                const newContent = doc.body.innerHTML;

                if (newContent) {
                    mainContent.innerHTML = newContent;
                } else {
                    mainContent.innerHTML = '<p class="text-center">Le contenu n\'a pas pu être chargé. Veuillez réessayer.</p>';
                    console.error(`Aucun élément 'body' trouvé dans ${url}`);
                }
                
                // Ferme le menu après avoir chargé le contenu
                closeMenu();
                
                // Remonte en haut de la page
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.error('Erreur lors du chargement de la page:', error);
                mainContent.innerHTML = `<p class="text-center">Une erreur est survenue. Impossible de charger le contenu de la page : ${url}.</p>`;
                closeMenu();
            });
    };
});
