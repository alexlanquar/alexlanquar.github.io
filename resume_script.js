document.addEventListener('DOMContentLoaded', () => {
    // 1. GESTION DES ÉLÉMENTS AUDIO
    const music = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = document.getElementById('mute-icon');
    let hasStarted = false;

    

    // Lancement de la musique de fond au premier clic n'importe où sur la page
    document.addEventListener("click", () => {
        if (!hasStarted && music) {
            music.play()
                .then(() => { 
                    hasStarted = true; 
                })
                .catch(err => console.log("Lecture audio automatique bloquée par le navigateur :", err));
        }
    }, { once: true });

    // Gestion du bouton Mute (Activer / Couper le son)
    if (muteBtn && music && muteIcon) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Évite de déclencher le clic global de la page

            if (music.paused) {
                music.play();
                muteIcon.src = "./images/unmute.png"; // Icône volume actif
            } else {
                music.pause();
                muteIcon.src = "./images/mute.png";   // Icône volume coupé
            }
        });
    }

    // 2. GESTION DE LA REDIRECTION DU BOUTON ACCUEIL (SOURIS)
    const btnDesk = document.getElementById('btn-desk');
    
    if (btnDesk) {
        btnDesk.addEventListener('click', () => {
            window.location.href = 'desk.html'; 
        });
    }

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
});
