import Song from "../scripts/album.js";

class Player{
    constructor(){
    }

    renderPlayer(){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "../assets/player/player.css";
        document.head.appendChild(link);
    
        var playerDiv = document.createElement("div");
        playerDiv.classList.add("player");
    
        var audioPlayerDiv = document.createElement("div");
        audioPlayerDiv.classList.add("audio-player");
    
        var controlsDiv = document.createElement("div");
        controlsDiv.classList.add("controls");
    
        var songInformationDiv = document.createElement("div");
        songInformationDiv.classList.add("song-information");
    
        var songImageDiv = document.createElement("div");
        songImageDiv.classList.add("song-image");
        var songImage = document.createElement("img");
        songImage.src = "";
        songImage.alt = "";
        songImageDiv.appendChild(songImage);
    
        var songNameDiv = document.createElement("div");
        songNameDiv.classList.add("song-name");
        songNameDiv.id = "song-name";

        songNameDiv.addEventListener("click", () => {

        })

        var songNameLink = document.createElement("a");
        songNameLink.href = "#";
        songNameLink.textContent = "No name";
        songNameLink.id = "songName";
        songNameDiv.appendChild(songNameLink);
    
        var artistNameDiv = document.createElement("div");
        artistNameDiv.classList.add("artist-name");
        artistNameDiv.id = "artist-name";
        var artistNameLink = document.createElement("a");
        artistNameLink.href = "#";
        artistNameLink.textContent = "No artist";
        artistNameLink.id = "songArtist";
        artistNameDiv.appendChild(artistNameLink);
    
        songInformationDiv.appendChild(songImageDiv);
        songInformationDiv.appendChild(songNameDiv);
        songInformationDiv.appendChild(artistNameDiv);
    
        var audioControlDiv = document.createElement("div");
        audioControlDiv.classList.add("audio-control");
    
        var controlButtonsDiv = document.createElement("div");
        controlButtonsDiv.classList.add("control-buttons");
        var prebSongBtn = document.createElement("button");
        prebSongBtn.id = "prebSongBtn";
        prebSongBtn.innerHTML = "|&lt;";
        var playPauseBtn = document.createElement("button");
        playPauseBtn.id = "playPauseBtn";
        playPauseBtn.innerHTML = "&gt;";
        var nextSongBtn = document.createElement("button");
        nextSongBtn.id = "nextSongBtn";
        nextSongBtn.innerHTML = "&gt;|";
        controlButtonsDiv.appendChild(prebSongBtn);
        controlButtonsDiv.appendChild(playPauseBtn);
        controlButtonsDiv.appendChild(nextSongBtn);
    
        var timeControlDiv = document.createElement("div");
        timeControlDiv.classList.add("time-control");
        var currentTimeDiv = document.createElement("div");
        currentTimeDiv.id = "currentTime";
        currentTimeDiv.textContent = "0:00";
        var timeSliderInput = document.createElement("input");
        timeSliderInput.type = "range";
        timeSliderInput.id = "timeSlider";
        timeSliderInput.min = "0";
        timeSliderInput.max = "1";
        timeSliderInput.step = "0.001";
        timeSliderInput.value = "0";
        var durationDiv = document.createElement("div");
        durationDiv.id = "duration";
        durationDiv.textContent = "0:00";
        timeControlDiv.appendChild(currentTimeDiv);
        timeControlDiv.appendChild(timeSliderInput);
        timeControlDiv.appendChild(durationDiv);
    
        audioControlDiv.appendChild(controlButtonsDiv);
        audioControlDiv.appendChild(timeControlDiv);
    
        var volumeController = document.createElement("div");
    
        var volumeSliderInput = document.createElement("input");
        volumeSliderInput.type = "range";
        volumeSliderInput.id = "volumeSlider";
        volumeSliderInput.min = "0";
        volumeSliderInput.max = "1";
        volumeSliderInput.step = "0.1";
        volumeSliderInput.value = "1";
    
        volumeController.appendChild(volumeSliderInput);
    
        controlsDiv.appendChild(songInformationDiv);
        controlsDiv.appendChild(audioControlDiv);
        controlsDiv.appendChild(volumeController);
    
        audioPlayerDiv.appendChild(controlsDiv);
    
        var audioPlayer = document.createElement("audio");
        audioPlayer.id = "audioPlayer";
    
        playerDiv.appendChild(audioPlayerDiv);
        playerDiv.appendChild(audioPlayer);
    
        document.body.appendChild(playerDiv);
    
        playPauseBtn.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.innerHTML = '| |';
                console.log(audioPlayer);
            } else {
                audioPlayer.pause();
                playPauseBtn.innerHTML = '&gt;';
                console.log(audioPlayer);
            }
        });
    
        volumeSliderInput.addEventListener('input', function() {
            audioPlayer.volume = volumeSliderInput.value;
        });
    
        audioPlayer.addEventListener('timeupdate', function() {
            const currentTime = audioPlayer.currentTime;
            const duration = audioPlayer.duration;
    
            timeSliderInput.value = currentTime / duration;
    
            currentTimeDiv.textContent = formatTime(currentTime);
            durationDiv.textContent = formatTime(duration);
        });
    
        let isSeeking = false;
    
        timeSliderInput.addEventListener('input', function() {
            isSeeking = true;
            const duration = audioPlayer.duration;
            const seekTo = duration * timeSliderInput.value;
    
            audioPlayer.currentTime = seekTo;
        });
    
        timeSliderInput.addEventListener('mouseup', function() {
            isSeeking = false; 
        });
    
        audioPlayer.addEventListener('timeupdate', function() {
            const currentTime = audioPlayer.currentTime;
            const duration = audioPlayer.duration;
            if (!isSeeking) {
                timeSliderInput.value = currentTime / duration;
            }
            currentTimeDiv.textContent = formatTime(currentTime);
            durationDiv.textContent = formatTime(duration);
        });
    
        audioPlayer.addEventListener('play', function(){
            playPauseBtn.innerHTML = '| |';
        });

        audioPlayer.addEventListener('ended', function(){
            playPauseBtn.innerHTML = '&gt;';
            timeSliderInput.value= 0;
            currentTimeDiv.textContent = '0:00';
        });
    
        document.addEventListener('keydown', function(event) {
            if (event.code === 'Space') {
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    playPauseBtn.innerHTML = '| |';
                } else {
                    audioPlayer.pause();
                    playPauseBtn.innerHTML = '&gt;';
                }
            }
        });
    }

    play(songId){
        console.log("Song ID: " + songId);
        $.ajax({
            type: "GET",
            url: "https://localhost:7219/Song/" + songId,
            success: (response) => {
                console.log("Song:", response);
                this.playSong(songId)
    
                document.getElementById("songName").textContent = response.title;
                document.getElementById("songArtist").textContent = response.artistName;
            },
            error: (error) => {
                console.error("Помилка при отриманні списку пісень:", error);
            }
        });
    }
    
    playSong(songId){
        console.log(songId + " is not playing!");
        const apiUrl = `https://localhost:7219/Audio/${songId}`;
        axios.get(apiUrl, {
                responseType: 'arraybuffer'
            })
            .then(response => {
                const audioData = response.data;
                const audioUrl = URL.createObjectURL(new Blob([audioData]));
            
                const audioElement = document.getElementById('audioPlayer')
                audioElement.src = audioUrl;
                
                audioElement.play();
            })
            .catch(error => {
                console.error('Error fetching audio file:', error);
            });
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export default Player;