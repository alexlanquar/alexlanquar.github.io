document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = document.getElementById('mute-icon');

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
                muteIcon.src = "images/unmute.png"; // Image de lecture
            } else {
                music.pause();
                muteIcon.src = "images/mute.png";   // Image de pause
            }
        });
    }
});
