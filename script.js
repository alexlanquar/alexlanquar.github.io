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

    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from'); // bouton de navigation d'où vient le personnage

    const speed = 5;
    const keys = {};

    // === POSITION DE DÉPART ===
    // Sur l'accueil : au milieu de l'écran.
    // Sur toutes les autres pages : au niveau du dessin de la sortie
    // (le bouton "Retour à l'accueil", invisible mais toujours positionné dessus).
    const isHomePage = document.body.dataset.page === 'home';

    function getSpawnPosition() {

        if (from === "btn-cv") {
            const cvDesk = document.querySelector('.prop.prop--accent-cv'); // bureau CV
            if (cvDesk) {
                const r = cvDesk.getBoundingClientRect();
                return {
                    x: r.left + r.width / 2 + 100,
                    y: r.bottom - 100 // spawn juste devant le bureau
                };
            }
        }

        if (!isHomePage) {
            const homeBtn = document.getElementById('btn-home');
            if (homeBtn) {
                const rect = homeBtn.getBoundingClientRect();
                return {
                    x: rect.left + rect.width / 2 - 20,
                    y: rect.top + rect.height / 2 - 20
                };
            }
        }

        return {
            x: window.innerWidth / 2 - 20,
            y: window.innerHeight / 2 - 20
        };
    }

    const spawn = getSpawnPosition();
    let positionX = spawn.x;
    let positionY = spawn.y;

    // === OBSTACLES ===
    // La hitbox de chaque meuble est directement sa taille/position réelle
    // dans le HTML (tout élément avec la classe "obstacle" dans #game-world).
    // Changer width/height/left/top du div change donc AUTOMATIQUEMENT
    // à la fois le visuel et la collision : une seule source de vérité.
    const gameWorld = document.getElementById('game-world');

    function getObstacleRects() {
        if (!gameWorld) return [];
        return Array.from(gameWorld.querySelectorAll('.obstacle'))
            .map(el => el.getBoundingClientRect());
    }

    function rectsOverlap(a, b) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }

    // === ZONES DE PROXIMITÉ ===
    // Contrairement aux boutons de navigation, ces zones ne mènent nulle part :
    // elles affichent/masquent un élément (ex : la carte de contact) quand le
    // personnage s'en approche.
    const proximityConfig = {
        desk: [
            { zoneId: 'contact-trigger', targetId: 'contact-card', radius: 120 },
            { zoneId: 'easter-egg-trigger', targetId: 'easter-egg-card', radius: 100 }
        ]
    };
    const proximityZones = proximityConfig[document.body.dataset.page] || [];

    function updateProximityZones() {
        proximityZones.forEach(zone => {
            const marker = document.getElementById(zone.zoneId);
            const target = document.getElementById(zone.targetId);
            if (!marker || !target) return;
            const near = distanceToButton(marker) < zone.radius;
            target.classList.toggle('visible', near);
        });
    }

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
            const spawnParam = btn.dataset.spawn ? `?from=${btn.dataset.spawn}` : '';
            goToPage(target.url + spawnParam);
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
        if (key === 'h') {
            document.body.classList.toggle('debug-hitboxes');
        }
        keys[key] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    // Distance entre le personnage et un élément cible : mesurée entre les
    // BORDS des deux rectangles (0 si le personnage touche ou est à
    // l'intérieur de la zone), et non entre leurs centres. Plus fiable pour
    // les grandes zones, où le centre peut tomber à un endroit inatteignable.
    function distanceToButton(btn) {
        const charRect = wrapper.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();

        const dx = Math.max(btnRect.left - charRect.right, charRect.left - btnRect.right, 0);
        const dy = Math.max(btnRect.top - charRect.bottom, charRect.top - btnRect.bottom, 0);

        return Math.sqrt(dx * dx + dy * dy);
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

        let dx = 0;
        let dy = 0;
        if (isMovingLeft) dx -= speed;
        if (isMovingRight) dx += speed;
        if (isMovingUp) dy -= speed;
        if (isMovingDown) dy += speed;

        if (isMovingLeft) character.style.transform = 'scaleX(1)';
        if (isMovingRight) character.style.transform = 'scaleX(-1)';

        // Collision avec les obstacles : on teste chaque axe séparément,
        // ce qui permet de glisser le long d'un bureau au lieu de se bloquer
        // net (slalom).
        if (dx !== 0 || dy !== 0) {
            const obstacleRects = getObstacleRects();
            if (obstacleRects.length > 0) {
                const charRect = wrapper.getBoundingClientRect();

                if (dx !== 0) {
                    const testRect = {
                        left: charRect.left + dx, right: charRect.right + dx,
                        top: charRect.top, bottom: charRect.bottom
                    };
                    if (obstacleRects.some(r => rectsOverlap(testRect, r))) dx = 0;
                }
                if (dy !== 0) {
                    const testRect = {
                        left: charRect.left + dx, right: charRect.right + dx,
                        top: charRect.top + dy, bottom: charRect.bottom + dy
                    };
                    if (obstacleRects.some(r => rectsOverlap(testRect, r))) dy = 0;
                }
            }
        }

        positionX += dx;
        positionY += dy;

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

        // Affiche/masque les éléments liés aux zones de proximité (ex : carte de contact)
        updateProximityZones();

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
