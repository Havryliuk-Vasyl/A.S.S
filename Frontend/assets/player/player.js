document.addEventListener("DOMContentLoaded", function(){
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const timeSlider = document.getElementById('timeSlider');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');

    playPauseBtn.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerHTML = '| |';
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '&gt;';
        }
    });

    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = volumeSlider.value;
    });

    audioPlayer.addEventListener('timeupdate', function() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;

        // Оновлення регулятора часу
        timeSlider.value = currentTime / duration;

        // Оновлення відображення часу
        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = formatTime(duration);
    });

    let isSeeking = false;

    timeSlider.addEventListener('input', function() {
        isSeeking = true;
        const duration = audioPlayer.duration;
        const seekTo = duration * timeSlider.value;

        audioPlayer.currentTime = seekTo;
    });

    timeSlider.addEventListener('mouseup', function() {
        isSeeking = false; 
    });

    audioPlayer.addEventListener('timeupdate', function() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        if (!isSeeking) {
            timeSlider.value = currentTime / duration;
        }
        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = formatTime(duration);
    });
});