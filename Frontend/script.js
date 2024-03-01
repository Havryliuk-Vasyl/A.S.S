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
                default:
                    // За замовчуванням завантажуємо, наприклад, search.html
                    pageFrame.src = 'search.html';
            }
        });
    });
});

function play(songId){
    const apiUrl = `https://localhost:7219/api/AudioStreaming/audio/${songId}`;
    axios.get(apiUrl, {
        responseType: 'arraybuffer'
    })
    .then(response => {
        const audioData = response.data;
        const audioUrl = URL.createObjectURL(new Blob([audioData]));
    
        // Отримуємо аудіоелемент
        const audioElement = document.querySelector('audio');
    
        // Встановлюємо джерело для аудіоелемента
        audioElement.src = audioUrl;
    
        // Відтворюємо аудіофайл
        audioElement.play();
    })
    .catch(error => {
        console.error('Error fetching audio file:', error);
    });
}