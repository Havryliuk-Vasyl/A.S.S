function play(songId){
    const apiUrl = `https://localhost:7219/api/audio/${songId}`;
    axios.get(apiUrl, {
        responseType: 'arraybuffer' // Вказуємо, що очікуємо отримати відповідь у вигляді масиву байтів
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