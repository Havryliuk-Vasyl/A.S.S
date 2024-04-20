var songsContainer = document.createElement("div");
    songsContainer.id = "songs-container";
    songsContainer.classList.add("container-style"); // Додайте клас для стилізації

    $.ajax({
        type: "GET",
        url: "https://localhost:7219/Song",
        success: function(response) {
            console.log("Songs:", response);
            renderRecentSongs(response);
        },
        error: function(error) {
            console.error("Помилка при отриманні списку пісень:", error);
        }
    })

    function renderRecentSongs(songs) {
        songs.forEach(function(item) {
            var songDiv = document.createElement("div");
            songDiv.classList.add("song");
            songDiv.setAttribute("data-id", item.song.id);

            var songInformationDiv = document.createElement("div");
            songInformationDiv.classList.add("song-information");

            var songPhotoDiv = document.createElement("div");
            songPhotoDiv.classList.add("song-photo");
            var songPhotoImg = document.createElement("img");
            songPhotoImg.src = "https://localhost:7219/Song/photo/" + item.photo.id; 
            songPhotoImg.alt = "Photo";
            songPhotoImg.style.maxWidth = "50px";
            songPhotoImg.style.maxHeight = "50px"; 
            songPhotoImg.style.width = "100%";
            songPhotoImg.style.height = "100%";
            songPhotoDiv.appendChild(songPhotoImg);

            var songNameDiv = document.createElement("div");
            songNameDiv.classList.add("song-name");
            songNameDiv.textContent = item.song.title;

            var artistDiv = document.createElement("div");
            artistDiv.classList.add("artist");
            artistDiv.textContent = item.artist;

            songInformationDiv.appendChild(songPhotoDiv);
            songInformationDiv.appendChild(songNameDiv);
            songInformationDiv.appendChild(artistDiv);

            var songPlayControlDiv = document.createElement("div");
            songPlayControlDiv.classList.add("song-play-control");

            var durationDiv = document.createElement("div");
            durationDiv.classList.add("duration");
            durationDiv.textContent = formatDuration(item.duration);

            var playButtonDiv = document.createElement("div");
            playButtonDiv.classList.add("play-button");
            playButtonDiv.textContent = ">";

            playButtonDiv.addEventListener("click", function() {
                var songId = item.song.id;
                $.ajax({
                    type: "GET",
                    url: "https://localhost:7219/audio/" + songId,
                    success: function(audioData) {
                        var audio = new Audio();
                        audio.src = URL.createObjectURL(new Blob([audioData], { type: "audio/mpeg" }));

                        audio.play();
                    },
                    error: function(error) {
                        console.error("Помилка при отриманні аудіоданих пісні:", error);
                    }
                });
            });

            songPlayControlDiv.appendChild(durationDiv);
            songPlayControlDiv.appendChild(playButtonDiv);

            songDiv.appendChild(songInformationDiv);
            songDiv.appendChild(songPlayControlDiv);

            songsContainer.appendChild(songDiv);

            document.getElementById("catalog").appendChild(songsContainer);
        });
    }
    
    function formatDuration(durationInSeconds) {
        var hours = Math.floor(durationInSeconds / 3600);
        var minutes = Math.floor((durationInSeconds % 3600) / 60);
        var seconds = Math.floor(durationInSeconds % 60);
    
        var formattedDuration = "";
    
        if (hours > 0) {
            formattedDuration += hours + ":";
        }
    
        formattedDuration += (minutes < 10 ? "0" : "") + minutes + ":";
        formattedDuration += (seconds < 10 ? "0" : "") + seconds;
    
        return formattedDuration;
    }