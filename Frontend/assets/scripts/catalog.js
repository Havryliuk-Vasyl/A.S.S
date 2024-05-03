import Player from '../player/player.js';
import Playlist from '../scripts/playlist.js';

class Catalog {
    constructor(){
        this.player = new Player();
        this.Playlist = new Playlist();
    }

    includeStyles(){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "../assets/styles/catalog.css";
        document.head.appendChild(link);
    }

    async getAudioList(){
        try {
            const response = await fetch("https://localhost:7219/Song");
            if (!response.ok) {
                throw new Error("Помилка при отриманні списку пісень");
            }
            const data = await response.json();
            console.log("Songs:", data);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async renderRecentSongs() {
        this.includeStyles();
        try {
            const songs = await this.getAudioList();
            console.log(songs);

            const songsContainer = document.createElement("div");
            songsContainer.id = "songs-container";
            songsContainer.classList.add("container-style");

            const songElements = songs.$values.map(item => {
                const songDiv = document.createElement("div");
                songDiv.classList.add("catalog-song");
                songDiv.setAttribute("data-id", item.song.id);

                const songInformationDiv = document.createElement("div");
                songInformationDiv.classList.add("catalog-song-information");

                const songPhotoDiv = document.createElement("div");
                songPhotoDiv.classList.add("catalog-song-photo");
                const songPhotoImg = document.createElement("img");
                songPhotoImg.src = "https://localhost:7219/Song/photo/" + item.photo.id;
                songPhotoImg.alt = "Photo";
                songPhotoImg.style.maxWidth = "50px";
                songPhotoImg.style.maxHeight = "50px";
                songPhotoImg.style.width = "100%";
                songPhotoImg.style.height = "100%";
                songPhotoDiv.appendChild(songPhotoImg);

                const songNameDiv = document.createElement("div");
                songNameDiv.classList.add("catalog-song-name");
                songNameDiv.textContent = item.song.title;

                const artistDiv = document.createElement("div");
                artistDiv.classList.add("catalog-artist");
                artistDiv.textContent = item.artist;

                songInformationDiv.appendChild(songPhotoDiv);
                songInformationDiv.appendChild(songNameDiv);
                songInformationDiv.appendChild(artistDiv);

                const songPlayControlDiv = document.createElement("div");
                songPlayControlDiv.classList.add("catalog-song-play-control");

                const durationDiv = document.createElement("div");
                durationDiv.classList.add("catalog-duration");
                durationDiv.textContent = this.formatDuration(item.duration);

                const playButtonDiv = document.createElement("div");
                playButtonDiv.classList.add("catalog-play-button");
                playButtonDiv.textContent = ">";

                playButtonDiv.addEventListener("click", () => {
                    this.player.play(item.song.id);
                });

                songPlayControlDiv.appendChild(durationDiv);
                songPlayControlDiv.appendChild(playButtonDiv);

                songDiv.appendChild(songInformationDiv);
                songDiv.appendChild(songPlayControlDiv);

                songDiv.addEventListener('dblclick', () => {
                    this.player.play(item.song.id);
                });

                let contextMenuOpen = false;

                songDiv.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                
                    if (!contextMenuOpen) {
                        const menu = document.createElement('div');
                        menu.classList.add('context-menu');
                    
                        const menuItem1 = document.createElement('div');
                        menuItem1.textContent = 'Відтворити';
                        menuItem1.addEventListener('click', () => {
                            this.player.play(item.song.id);
                        });
                    
                        const menuItem2 = document.createElement('div');
                        menuItem2.textContent = 'Додати в плейлист';
                        menuItem2.addEventListener('click', () => {
                            console.log('Menu Item 2 clicked for song with id', item.song.id);
                        });
                    
                        menu.appendChild(menuItem1);
                        menu.appendChild(menuItem2);
                    
                        menu.style.top = event.clientY + 'px';
                        menu.style.left = event.clientX + 'px';
                    
                        document.body.appendChild(menu);
                    
                        contextMenuOpen = true;
                    
                        document.addEventListener('click', () => {
                            menu.remove();
                            contextMenuOpen = false;
                        }, { once: true });
                    
                        menu.addEventListener('click', () => {
                            menu.remove();
                            contextMenuOpen = false;
                        });
                    }
                });
                return songDiv;
            });

            songElements.forEach(songElement => {
                songsContainer.appendChild(songElement);
            });

            document.getElementById("displayField").appendChild(songsContainer);
        } catch (error) {
            console.error("Помилка під час відображення пісень:", error);
        }
    }  

    formatDuration(durationInSeconds) {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);

        let formattedDuration = "";

        if (hours > 0) {
            formattedDuration += hours + ":";
        }

        formattedDuration += (minutes < 10 ? "0" : "") + minutes + ":";
        formattedDuration += (seconds < 10 ? "0" : "") + seconds;

        return formattedDuration;
    }
}

export default Catalog;
