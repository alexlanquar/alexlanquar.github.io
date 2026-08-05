document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = document.getElementById('mute-icon');

    const btnHome = document.getElementById('btn-home');
    const btnDesk = document.getElementById('btn-desk');
    const btnTravel = document.getElementById('btn-travel');
    const btnProjects = document.getElementById('btn-projects');
    const btnCV = document.getElementById('btn-cv');

    const sectionHome = document.getElementById('index.html');
    const sectionResume = document.getElementById('resume.html');
    const sectionTravel = document.getElementById('travel.html');
    const sectionProjects = document.getElementById('projeccts.html');

    // Gestion du joueur (Adapté à la structure avec texte)
    const wrapper = document.getElementById('character-wrapper');
    const character = document.getElementById('character');
    const actionText = document.getElementById('action-text');

    let positionX = window.innerWidth / 2 - 20;
    let positionY = window.innerHeight / 2 - 20;
    const speed = 5; 
    const keys = {};

    // Config des textures
    const imageBase = "./images/base.png";
    const imageWalk = "./images/right_walk.gif";
    const width_base = 40; 
    const width_walk = 60; 

    // Liste des boutons pour les calculs de collision/distance
    const navigationTargets = [
        { buttonId: 'btn-home', url: './index.html' },
        { buttonId: 'btn-travel', url: './travel.html' },
        { buttonId: 'btn-projects', url: './projects.html' },
        { buttonId: 'btn-desk', url: './desk.html' },
        { buttonId: 'btn-cv', url: './resume.html' }
    ];

    // Écouteurs clavier
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'enter' || key === 'e') {
            e.preventDefault(); 
            interactWithSection();
        }
        keys[key] = true;
    });

    window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        keys[key] = false;
    });

    let hasStarted = false;

    // Fonction pour calculer la distance avec le bouton le plus proche
    function getClosestButtonDistance() {
        if (!wrapper) return Infinity;
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let minDistance = Infinity;

        navigationTargets.forEach(target => {
            const btn = document.getElementById(target.buttonId);
            if (!btn) return;

            const btnRect = btn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            const distance = Math.sqrt(Math.pow(centerX - btnCenterX, 2) + Math.pow(centerY - btnCenterY, 2));
            if (distance < minDistance) {
                minDistance = distance;
            }
        });

        return minDistance;
    }

    // Boucle d'animation principale
    function updateMovement() {
        if (!wrapper || !character) return;

        const isMovingUp = keys['arrowup'] || keys['z'];
        const isMovingDown = keys['arrowdown'] || keys['s'];
        const isMovingLeft = keys['arrowleft'] || keys['q'];
        const isMovingRight = keys['arrowright'] || keys['d'];
        const isMoving = isMovingUp || isMovingDown || isMovingLeft || isMovingRight;

        if (isMovingUp) positionY -= speed;
        if (isMovingDown) positionY += speed;

        if (isMovingLeft) {
            positionX -= speed;
            character.style.transform = 'scaleX(1)'; 
        }
        if (isMovingRight) {
            positionX += speed;
            character.style.transform = 'scaleX(-1)'; 
        }

        // Texture dynamique
        if (isMoving) {
            if (!character.src.includes('walk')) {
                character.style.width = width_walk + 'px';
                character.src = imageWalk;
            }
        } else {
            if (!character.src.includes('base')) {
                character.style.width = width_base + 'px';
                character.src = imageBase;
            }
        }

        // Gestion de l'affichage du texte indicateur
        if (actionText) {
            const currentDistance = getClosestButtonDistance();
            if (currentDistance < 150) {
                actionText.style.visibility = 'visible';
                actionText.style.opacity = '1';
            } else {
                actionText.style.opacity = '0';
                actionText.style.visibility = 'hidden';
            }
        }

        if (wrapper) {
            const currentWidth = isMoving ? 60 : 40;
            
            // window.innerHeight empêche de descendre sous l'écran visible si la page est courte
            const maxPosX = window.innerWidth - currentWidth;
            const maxPosY = Math.max(document.documentElement.clientHeight, window.innerHeight) - 50; 

            positionX = Math.max(0, Math.min(positionX, maxPosX));
            positionY = Math.max(0, Math.min(positionY, maxPosY));

            wrapper.style.left = positionX + 'px';
            wrapper.style.top = positionY + 'px';
        }

        requestAnimationFrame(updateMovement);
    }

    requestAnimationFrame(updateMovement);

    // Audio de fond au démarrage
    document.addEventListener("click", () => {
        if (!hasStarted && music) {
            music.play()
                .then(() => { hasStarted = true; })
                .catch(err => console.log("Lecture auto bloquée :", err));
        }
    }, { once: true });

    // Contrôle du bouton Mute
    if (muteBtn && music && muteIcon) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (music.paused) {
                music.play();
                muteIcon.src = "./images/unmute.png";
            } else {
                music.pause();
                muteIcon.src = "./images/mute.png";
            }
        });
    }

    // Interaction sur pression de la touche Entrée
    function interactWithSection() {
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let closestTarget = null;
        let minDistance = 150; 

        navigationTargets.forEach(target => {
            const btn = document.getElementById(target.buttonId);
            if (!btn) return;

            const btnRect = btn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            const distance = Math.sqrt(Math.pow(centerX - btnCenterX, 2) + Math.pow(centerY - btnCenterY, 2));
            if (distance < minDistance) {
                minDistance = distance;
                closestTarget = target;
            }
        });

        if (closestTarget) {
            if (character) {
                character.style.filter = 'brightness(0.7)';
                setTimeout(() => { 
                    character.style.filter = 'brightness(1)';
                    window.location.href = closestTarget.url;
                },200);
            }
        }
    }
});
