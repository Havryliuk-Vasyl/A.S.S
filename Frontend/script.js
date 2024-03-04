document.addEventListener("DOMContentLoaded", function() {
    // Отримуємо посилання на всі пункти меню
    var menuItems = document.querySelectorAll('.menu nav ul li');

    // Додаємо обробник події для кожного пункту меню
    menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var pageFrame = document.getElementById('pageFrame');
            // Змінюємо src iframe в залежності від тексту пункту меню
            switch (item.textContent) {
                case 'Search':
                    pageFrame.src = 'assets/pages/search.html';
                    break;
                case 'Registration':
                    pageFrame.src = 'assets/pages/registration.html';
                    break;
                case 'Songs':
                    pageFrame.src = 'assets/pages/songs.html';
                    break;
                case 'Share Song':
                    pageFrame.src = 'assets/pages/sharesong.html';
                    break;
                default:
                    // За замовчуванням завантажуємо, наприклад, search.html
                    pageFrame.src = 'search.html';
            }
        });
    });

    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const timeSlider = document.getElementById('timeSlider');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');

    playPauseBtn.addEventListener('click', function() {
        if (audioPlayer.paused || audioPlayer.ended) {
            audioPlayer.play();
            playPauseBtn.innerHTML = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = 'Play';
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
        isSeeking = true; // Встановлюємо, що відбувається зміна через timeSlider
        const duration = audioPlayer.duration;
        const seekTo = duration * timeSlider.value;

        // Зміна часу програвання за допомогою регулятора
        audioPlayer.currentTime = seekTo;
    });

    timeSlider.addEventListener('mouseup', function() {
        isSeeking = false; 
    });

    audioPlayer.addEventListener('timeupdate', function() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;

        // Оновлюємо регулятор часу, лише якщо не відбувається зміна через timeSlider
        if (!isSeeking) {
            timeSlider.value = currentTime / duration;
        }

        // Оновлюємо відображення часу
        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = formatTime(duration);
    });


});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainderSeconds < 10 ? '0' + remainderSeconds : remainderSeconds;
    return `${minutes}:${formattedSeconds}`;
}

function play(songId){
    const apiUrl = `https://localhost:7219/api/AudioStreaming/audio/${songId}`;
    axios.get(apiUrl, {
        responseType: 'arraybuffer'
    })
    .then(response => {
        const audioData = response.data;
        const audioUrl = URL.createObjectURL(new Blob([audioData]));
    
        // Отримуємо аудіоелемент
        const audioElement = document.getElementById('audioPlayer');
    
        // Встановлюємо джерело для аудіоелемента
        audioElement.src = audioUrl;
    
        // Відтворюємо аудіофайл
        audioElement.play();
    })
    .catch(error => {
        console.error('Error fetching audio file:', error);
    });
}
