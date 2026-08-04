document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = document.getElementById('mute-icon');

    const btnHome = document.getElementById('btn-home');
    const btnResume = document.getElementById('btn-resume');
    const btnTravel = document.getElementById('btn-travel');
    const btnProjects = document.getElementById('btn-projects');

    const sectionHome = document.getElementById('section-home');
    const sectionResume = document.getElementById('section-resume');
    const sectionTravel = document.getElementById('section-travel');
    const sectionProjects = document.getElementById('section-projects');

    // gestion du joueur
    const character = document.getElementById('character');
    let positionX = 0;
    let positionY = 0;
    const speed = 8;
    const keys = {};

    // Key down / up
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    let hasStarted = false;

    // Boucle d'animation pour le mouvement du personnage
    function updateMovement() {
        // Déplacement vers le haut (Flèche Haut ou Z)
        if (keys['arrowup'] || keys['z']) {
            positionY -= speed;
        }
        // Déplacement vers le bas (Flèche Bas ou S)
        if (keys['arrowdown'] || keys['s']) {
            positionY += speed;
        }
        // Déplacement vers la gauche (Flèche Gauche ou Q)
        if (keys['arrowleft'] || keys['q']) {
            positionX -= speed;
            if (character) character.style.transform = 'scaleX(-1)'; // Retourne le sprite vers la gauche
        }
        // Déplacement vers la droite (Flèche Droite ou D)
        if (keys['arrowright'] || keys['d']) {
            positionX += speed;
            if (character) character.style.transform = 'scaleX(1)'; // Remet le sprite vers la droite
        }

        // Limites de l'écran (Optionnel : empêche de sortir de la page)
        if (character) {
            positionX = Math.max(0, Math.min(positionX, window.innerWidth - character.clientWidth));
            positionY = Math.max(0, Math.min(positionY, document.documentElement.scrollHeight - character.clientHeight));

            // Application des nouvelles coordonnées
            character.style.left = positionX + 'px';
            character.style.top = positionY + 'px';
        }
        // Relancer la boucle au prochain rafraîchissement d'écran
        requestAnimationFrame(updateMovement);
    }

    requestAnimationFrame(updateMovement);

    document.addEventListener("click", () => {
        if (!hasStarted && music) {
            music.play()
                .then(() => {
                    hasStarted = true;
                })
                .catch(err => console.log("Lecture auto bloquée :", err));
        }
    }, { once: true });

    if (muteBtn && music && muteIcon) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche le conflit avec le clic global

            if (music.paused) {
                music.play();
                muteIcon.src = "./images/unmute.png"; // Image de lecture
            } else {
                music.pause();
                muteIcon.src = "./images/mute.png";   // Image de pause
            }
        });
    }


    if (btnHome && btnTravel && btnResume && btnProjects && sectionHome && sectionTravel && sectionResume  && sectionProjects) {
        btnHome.addEventListener('click', () => {
            // Activer le bouton Accueil
            btnHome.classList.add('active');
            btnResume.classList.remove('active');
            btnTravel.classList.remove('active');
            btnProjects.classList.remove('active');
            // Afficher l'accueil, masquer le PDF
            sectionHome.classList.remove('hidden');
            sectionResume.classList.add('hidden');
            sectionTravel.classList.add('hidden');
            sectionProjects.classList.add('hidden');
        });

        btnResume.addEventListener('click', () => {
            // Activer le bouton Document
            btnResume.classList.add('active');
            btnHome.classList.remove('active');
            btnTravel.classList.remove('active');
            btnProjects.classList.remove('active');
            // Afficher le PDF, masquer l'accueil
            sectionResume.classList.remove('hidden');
            sectionHome.classList.add('hidden');
            sectionTravel.classList.add('hidden');
            sectionProjects.classList.add('hidden');
        });

        btnTravel.addEventListener('click', () => {
            // Activer le bouton Document
            btnResume.classList.remove('active');
            btnHome.classList.remove('active');
            btnTravel.classList.add('active');
            btnProjects.classList.remove('active');
            // Afficher le PDF, masquer l'accueil
            sectionTravel.classList.remove('hidden');
            sectionHome.classList.add('hidden');
            sectionResume.classList.add('hidden');
            sectionProjects.classList.add('hidden');
        });

        btnProjects.addEventListener('click', () => {
            // Activer le bouton Document
            btnResume.classList.remove('active');
            btnHome.classList.remove('active');
            btnTravel.classList.remove('active');
            btnProjects.classList.add('active');
            // Afficher le PDF, masquer l'accueil
            sectionProjects.classList.remove('hidden');
            sectionHome.classList.add('hidden');
            sectionResume.classList.add('hidden');
            sectionTravel.classList.add('hidden');
        });
    }

});
