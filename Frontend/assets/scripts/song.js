document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://localhost:7219/api/Media/media';

    // Функція, яка завантажує список пісень з сервера
    function loadMediaList() {
        axios.get(apiUrl)
            .then(response => {
                const mediaList = response.data;
                displayMediaList(mediaList);
            })
            .catch(error => {
                console.error('Error loading media list:', error);
            });
    }
    console.log("Hi");
    // Функція, яка відображає список пісень на сторінці
    function displayMediaList(mediaList) {
        const songsContainer = document.getElementById('songs');

        mediaList.forEach(media => {
            const songDiv = document.createElement('div');
            songDiv.classList.add('song');

            const nameDiv = document.createElement('div');
            nameDiv.innerText = media.title;
            nameDiv.classList.add('name');

            const playButton = document.createElement('button');
            playButton.innerText = '>';
            playButton.classList.add('play-song');
            playButton.value = media.id;
            playButton.addEventListener('click', function() {
                play(media.id);
            });

            songDiv.appendChild(nameDiv);
            songDiv.appendChild(playButton);

            songsContainer.appendChild(songDiv);
        });
    }

    // Викликаємо функцію для завантаження списку пісень при завантаженні сторінки
    loadMediaList();
});
