document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = document.getElementById('mute-icon');
    const btnHome = document.getElementById('btn-home');
    const btnDoc = document.getElementById('btn-doc');
    const btnVoy = document.getElementById('btn-voyage');
    const sectionHome = document.getElementById('section-home');
    const sectionDoc = document.getElementById('section-doc');
    const sectionVoy = document.getElementById('section-voyage');

    let hasStarted = false;

    // 1. Lance la musique au premier clic sur la page (sécurité navigateur)
    document.addEventListener('click', () => {
        if (!hasStarted && music) {
            music.play()
                .then(() => {
                    hasStarted = true;
                })
                .catch(err => console.log("Lecture auto bloquée :", err));
        }
    }, { once: true });

    // 2. Gestion du bouton Play / Pause
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


    if (btnHome && btnDoc && sectionHome && sectionDoc) {
        btnHome.addEventListener('click', () => {
            // Activer le bouton Accueil
            btnHome.classList.add('active');
            btnDoc.classList.remove('active');
            btnVoy.classList.remove('active');
            // Afficher l'accueil, masquer le PDF
            sectionHome.classList.remove('hidden');
            sectionDoc.classList.add('hidden');
            sectionVoy.classList.add('hidden');
        });

        btnDoc.addEventListener('click', () => {
            // Activer le bouton Document
            btnDoc.classList.add('active');
            btnHome.classList.remove('active');
            btnVoy.classList.remove('active');
            // Afficher le PDF, masquer l'accueil
            sectionDoc.classList.remove('hidden');
            sectionHome.classList.add('hidden');
            sectionVoy.classList.add('hidden');
        });

        btnVoy.addEventListener('click', () => {
            // Activer le bouton Document
            btnDoc.classList.remove('active');
            btnHome.classList.remove('active');
            btnVoy.classList.add('active');
            // Afficher le PDF, masquer l'accueil
            sectionVoy.classList.remove('hidden');
            sectionHome.classList.add('hidden');
            sectionDoc.classList.add('hidden');
        });
    }

});
