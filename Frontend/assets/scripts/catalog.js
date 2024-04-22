import Player from '../player/player.js';

class Catalog {
    constructor(){
        this.player = new Player();
    }

    includeStyles(){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "../assets/styles/catalog.css";
        document.head.appendChild(link);
    }

    getAudioList(){
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: "https://localhost:7219/Song",
                success: function(response) {
                    console.log("Songs:", response);
                    resolve(response);
                },
                error: function(error) {
                    console.error("Помилка при отриманні списку пісень:", error);
                    reject(error);
                }
            });
        });
    }
    async renderRecentSongs() {
        this.includeStyles();
        try {
            const songs = await this.getAudioList();
            console.log(songs);

            var songsContainer = document.createElement("div");
            songsContainer.id = "songs-container";
            songsContainer.classList.add("container-style");

            console.log(songs);
            const self = this;
            songs.forEach(function(item) {
            var songDiv = document.createElement("div");
            songDiv.classList.add("catalog-song");
            songDiv.setAttribute("data-id", item.song.id);

            var songInformationDiv = document.createElement("div");
            songInformationDiv.classList.add("catalog-song-information");

            var songPhotoDiv = document.createElement("div");
            songPhotoDiv.classList.add("catalog-song-photo");
            var songPhotoImg = document.createElement("img");
            songPhotoImg.src = "https://localhost:7219/Song/photo/" + item.photo.id;
            songPhotoImg.alt = "Photo";
            songPhotoImg.style.maxWidth = "50px";
            songPhotoImg.style.maxHeight = "50px";
            songPhotoImg.style.width = "100%";
            songPhotoImg.style.height = "100%";
            songPhotoDiv.appendChild(songPhotoImg);

            var songNameDiv = document.createElement("div");
            songNameDiv.classList.add("catalog-song-name");
            songNameDiv.textContent = item.song.title;

            var artistDiv = document.createElement("div");
            artistDiv.classList.add("catalog-artist");
            artistDiv.textContent = item.artist;

            songInformationDiv.appendChild(songPhotoDiv);
            songInformationDiv.appendChild(songNameDiv);
            songInformationDiv.appendChild(artistDiv);

            var songPlayControlDiv = document.createElement("div");
            songPlayControlDiv.classList.add("catalog-song-play-control");

            var durationDiv = document.createElement("div");
            durationDiv.classList.add("catalog-duration");
            durationDiv.textContent = formatDuration(item.duration);

            var playButtonDiv = document.createElement("div");
            playButtonDiv.classList.add("catalog-play-button");
            playButtonDiv.textContent = ">";

            playButtonDiv.addEventListener("click", () => {
                self.player.play(item.song.id);
            });

            songPlayControlDiv.appendChild(durationDiv);
            songPlayControlDiv.appendChild(playButtonDiv);

            songDiv.appendChild(songInformationDiv);
            songDiv.appendChild(songPlayControlDiv);

            songDiv.addEventListener('dblclick', () => {
                self.player.play(item.song.id);
            });

            songsContainer.appendChild(songDiv);
            });
            document.getElementById("catalog").appendChild(songsContainer);
        } catch (error) {
            console.error("Помилка під час відображення пісень:", error);
        }
    }  
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

export default Catalog;