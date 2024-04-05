document.addEventListener("DOMContentLoaded", function() {
    
    $.ajax({
        type: "GET",
        url: "https://localhost:7219/User/validateToken",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
            console.log("User profile:", response);

            const username = response.username;
            
            const profileUsername = document.getElementById('profile-username');

            renderUsersFunctionality(response);

            profileUsername.textContent = username;
        },
        error: function(error) {
            window.location.href = 'assets/pages/authorization.html';
        }
    });

    document.getElementById("profile").addEventListener("click", function(){
        var userProfileURL = "assets/pages/profile.html";
        document.getElementById("pageFrame").src = userProfileURL;
    });

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

    function renderUsersFunctionality(user){
        if (user.status === "administrator"){
            let navigationOnMenu = document.getElementById("navigation-on-menu");
            
            let adminPanel = document.createElement("li");
            let linkOnAdminPanel = document.createElement("a");
            linkOnAdminPanel.id = "adminPanel";
            linkOnAdminPanel.innerText="Панель адміна";
            linkOnAdminPanel.href = "#";

            adminPanel.appendChild(linkOnAdminPanel);
            
            navigationOnMenu.appendChild(adminPanel);
        }
        else if (user.status === "artist"){
            let navigationOnMenu = document.getElementById("navigation-on-menu");
            
            let artistPanel = document.createElement("li");
            let linkOnArtistPanel = document.createElement("a");
            linkOnArtistPanel.id = "artistPanel";
            linkOnArtistPanel.innerText="Панель артиста";
            linkOnArtistPanel.href = "#";

            artistPanel.appendChild(linkOnArtistPanel);
            
            navigationOnMenu.appendChild(artistPanel);
        }
    }
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
    
        const audioElement = document.getElementById('audioPlayer');
    
        audioElement.src = audioUrl;
    
        audioElement.play();
    })
    .catch(error => {
        console.error('Error fetching audio file:', error);
    });
}