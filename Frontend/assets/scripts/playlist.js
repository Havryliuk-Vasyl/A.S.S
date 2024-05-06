import Player from '../player/player.js';
import Catalog from './catalog.js';

class Playlist {
    constructor() {
        this.includeStyles();
        this.player = new Player();
    }

    includeStyles() {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "../assets/styles/playlistInQuikAccess.css";
        document.head.appendChild(link);
    }

    async getUserPlaylists(userId) {
        try {
            const response = await fetch(`https://localhost:7219/Playlist/${userId}`);
            if (!response.ok) {
                throw new Error("Помилка при отриманні списку плейлистів користувача");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getUserPlaylist(playlistId){
        try {
            const response = await fetch(`https://localhost:7219/Playlist/Playlist/${playlistId}`);
            if (!response.ok) {
                throw new Error("Помилка при отриманні плейлиста");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async renderUserPlaylistsInQuikAccess(userId) {
        const playlistsContainer = document.getElementById("playlistsInMain");
        try {
            const playlists = await this.getUserPlaylists(userId);
            playlists.$values.forEach(playlist => {
                const playlistElement = document.createElement("div");
                playlistElement.classList.add("playlist-catalog");
                playlistElement.classList.add("playlist-item");
                playlistElement.innerHTML = `
                <!-- <div class="playlist-photo"></div> -->
                    <div class="playlist-name">${playlist.title}</div>
                `;

                playlistElement.addEventListener("click", () => {
                    this.renderSelectedPlaylist(playlist.id);
                });
                playlistsContainer.appendChild(playlistElement);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async renderSelectedPlaylist(playlistId) {
        const displayField = document.getElementById("displayField");
    
        try {
            const playlistInfo = document.createElement("div");
            playlistInfo.classList.add("playlist-in-display-field");
    
            const playlistData = await this.getUserPlaylist(playlistId);
    
            const playlistName = document.createElement("div");
            playlistName.classList.add("playlist-name");
            playlistName.textContent = playlistData.playlist.title;
    
            const songsContainer = document.createElement("div");
            songsContainer.id = "songs-container";
            songsContainer.classList.add("container-style");
    
            console.log(playlistData);

            // Ітеруємося по піснях зі списку
            playlistData.songs.$values.forEach(item => {
                const songDiv = document.createElement("div");
                songDiv.classList.add("catalog-song");
                const songId = item.audio.song;
                console.log(item.audio.song);
                songDiv.setAttribute("data-id", songId);
    
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
    
                // Додаємо ім'я та виконавця пісні
                const songNameDiv = document.createElement("div");
                songNameDiv.classList.add("catalog-song-name");
                songNameDiv.textContent = item.song.title;
    
                const artistDiv = document.createElement("div");
                artistDiv.classList.add("catalog-artist");
                artistDiv.textContent = item.song.artist;
    
                // Додаємо блок інформації про пісню до основного блоку пісні
                songInformationDiv.appendChild(songPhotoDiv);
                songInformationDiv.appendChild(songNameDiv);
                songInformationDiv.appendChild(artistDiv);
    
                // Створюємо блок управління піснею
                const songPlayControlDiv = document.createElement("div");
                songPlayControlDiv.classList.add("catalog-song-play-control");
    
                // Додаємо блок тривалості пісні
                const durationDiv = document.createElement("div");
                durationDiv.classList.add("catalog-duration");
                durationDiv.textContent = this.formatDuration(item.audio.duration);
    
                // Додаємо кнопку "Відтворити"
                const playButtonDiv = document.createElement("div");
                playButtonDiv.classList.add("catalog-play-button");
                playButtonDiv.textContent = ">";
                playButtonDiv.addEventListener("click", () => {
                    this.player.play(songId);
                });
    
                songPlayControlDiv.appendChild(durationDiv);
                songPlayControlDiv.appendChild(playButtonDiv);
    
                songDiv.appendChild(songInformationDiv);
                songDiv.appendChild(songPlayControlDiv);
    
                songDiv.addEventListener('dblclick', () => {
                    this.player.play(songId);
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
                            console.log("Song ID: " + songId);
                            this.player.play(songId);
                        });
    
                        const menuItem2 = document.createElement('div');
                        menuItem2.textContent = 'Видалити з плейлиста';
                        menuItem2.addEventListener('click', () => {
                            
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
                songsContainer.appendChild(songDiv);
            });
    
            displayField.innerHTML = "";
    
            playlistInfo.appendChild(playlistName);
            playlistInfo.appendChild(songsContainer);
    
            displayField.appendChild(playlistInfo);
        } catch (error) {
            console.error(error);
        }
    }
    
    async renderCatalogOfUsersPlaylist(userId) {
        const displayField = document.getElementById("displayField");
    
        try {
            const playlists = await this.getUserPlaylists(userId);
    
            displayField.innerHTML = "";
    
            playlists.$values.forEach(playlist => {
                const playlistElement = document.createElement("div");
                playlistElement.classList.add("playlist");
                playlistElement.innerHTML = `
                    <!-- <div class="playlist-photo"></div> -->
                    <div class="playlist-name">${playlist.title}</div>
                `;
    
                playlistElement.addEventListener("click", () => {
                    this.renderSelectedPlaylist(playlist.id);
                });
    
                displayField.appendChild(playlistElement);
            });
        } catch (error) {
            console.error(error);
        }
    }
    

    async addToPlaylist(songId, playlistId) {
        try {
            const response = await fetch(`https://localhost:7219/Playlist/${playlistId}/AddSong`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: songId.toString()
            });
    
            if (!response.ok) {
                throw new Error(`Failed to add song to playlist. Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error adding song to playlist:', error);
        }
    }
    
    async createPlaylist(userId, playlistTitle) {
        console.log(userId + " " + playlistTitle)
        try {
            const response = await fetch('https://localhost:7219/Playlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: userId,
                    Title: playlistTitle
                })
            });
    
            if (!response.ok) {
                throw new Error('Помилка при створенні плейлиста');
            }
    
            const data = await response.json();
            console.log('Новий плейлист:', data);
        } catch (error) {
            console.error(error);
            throw error;
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

export default Playlist;