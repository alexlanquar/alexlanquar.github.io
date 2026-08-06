document.addEventListener('DOMContentLoaded', () => {
    // === AUDIO ===
    const music = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = document.getElementById('mute-icon');
    let hasStarted = false;

    // === PERSONNAGE ===
    const wrapper = document.getElementById('character-wrapper');
    const character = document.getElementById('character');
    const actionText = document.getElementById('action-text');

    let positionX = window.innerWidth / 2 - 20;
    let positionY = window.innerHeight / 2 - 20;
    const speed = 5;
    const keys = {};

    // Textures du personnage
    const imageBase = "./images/base.png";
    const imageWalk = "./images/right_walk.gif";
    const width_base = 40;
    const width_walk = 60;

    // === CIBLES DE NAVIGATION ===
    // Associe chaque bouton présent sur la page à la page vers laquelle il mène.
    // getElementById renvoie null pour les boutons absents de la page courante,
    // ils sont simplement ignorés plus bas.
    const navigationTargets = [
        { buttonId: 'btn-home',     url: './index.html' },
        { buttonId: 'btn-travel',   url: './travel.html' },
        { buttonId: 'btn-projects', url: './projects.html' },
        { buttonId: 'btn-desk',     url: './desk.html' },
        { buttonId: 'btn-cv',       url: './resume.html' }
    ];

    // Clic direct sur un bouton = navigation immédiate (fallback souris/tactile,
    // indispensable sur mobile où il n'y a pas de clavier pour marcher).
    navigationTargets.forEach(target => {
        const btn = document.getElementById(target.buttonId);
        if (!btn) return;
        btn.addEventListener('click', () => {
            goToPage(target.url);
        });
    });

    function goToPage(url) {
        if (character) {
            character.style.filter = 'brightness(0.7)';
            setTimeout(() => {
                character.style.filter = 'brightness(1)';
                window.location.href = url;
            }, 150);
        } else {
            window.location.href = url;
        }
    }

    // === CLAVIER ===
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'enter' || key === 'e') {
            e.preventDefault();
            interactWithClosestTarget();
        }
        keys[key] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    // Distance entre le centre du personnage et le centre d'un bouton
    function distanceToButton(btn) {
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const btnRect = btn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        return Math.sqrt(
            Math.pow(centerX - btnCenterX, 2) +
            Math.pow(centerY - btnCenterY, 2)
        );
    }

    // Renvoie la cible de navigation la plus proche du personnage,
    // ou null si aucune n'est à portée.
    function getClosestTarget(maxDistance = 150) {
        if (!wrapper) return null;
        let closest = null;
        let minDistance = maxDistance;

        navigationTargets.forEach(target => {
            const btn = document.getElementById(target.buttonId);
            if (!btn) return;
            const distance = distanceToButton(btn);
            if (distance < minDistance) {
                minDistance = distance;
                closest = target;
            }
        });

        return closest;
    }

    function interactWithClosestTarget() {
        const target = getClosestTarget();
        if (target) {
            goToPage(target.url);
        }
    }

    // === BOUCLE D'ANIMATION ===
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

        // Texture dynamique (marche / immobile)
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

        // Bulle "Appuyez sur Entrée"
        if (actionText) {
            const nearTarget = getClosestTarget();
            if (nearTarget) {
                actionText.style.visibility = 'visible';
                actionText.style.opacity = '1';
            } else {
                actionText.style.opacity = '0';
                actionText.style.visibility = 'hidden';
            }
        }

        // Limites de déplacement (empêche de sortir de l'écran / de la page)
        const currentWidth = isMoving ? width_walk : width_base;
        const maxPosX = window.innerWidth - currentWidth;
        const maxPosY = Math.max(document.body.scrollHeight, window.innerHeight) - 50;

        positionX = Math.max(0, Math.min(positionX, maxPosX));
        positionY = Math.max(0, Math.min(positionY, maxPosY));

        wrapper.style.left = positionX + 'px';
        wrapper.style.top = positionY + 'px';

        requestAnimationFrame(updateMovement);
    }

    requestAnimationFrame(updateMovement);

    // === MUSIQUE DE FOND ===
    document.addEventListener("click", () => {
        if (!hasStarted && music) {
            music.play()
                .then(() => { hasStarted = true; })
                .catch(err => console.log("Lecture auto bloquée :", err));
        }
    }, { once: true });

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
});
