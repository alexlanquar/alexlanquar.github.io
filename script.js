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
