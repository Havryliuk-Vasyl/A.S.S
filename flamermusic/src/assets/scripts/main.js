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
