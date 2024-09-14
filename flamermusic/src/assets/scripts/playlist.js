import Player from '../player/player.js';
import Song from './album.js';
import Catalog from './catalog.js';
import Profile from './profile.js';

class Playlist {
    constructor() {
        //this.includeStyles();
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

    async getUserPlaylist(playlistId) {
        try {
            const response = await fetch(`https://localhost:7219/Playlist/Playlist/${playlistId}`);
            if (!response.ok) {
                
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async renderUserPlaylistsInQuickAccess(userId) {
        const playlistsContainer = document.getElementById("playlistsInMain");
        const playlistListIf = document.querySelector(".playlist-list");

        if (playlistListIf) {
            playlistsContainer.removeChild(playlistListIf);
        }

        const playlistList = document.createElement("div");
        playlistList.classList.add("playlist-list");

        try {
            const playlists = await this.getUserPlaylists(userId);

            const playlistPromises = playlists.$values.map(async (playlist) => {
                const playlistElement = document.createElement("div");
                playlistElement.classList.add("playlist-catalog", "playlist-item");

                const playlistImageInQuickAccessDiv = document.createElement("div");
                playlistImageInQuickAccessDiv.classList.add("playlist-image-in-quick-access");

                const playlistImageInQuickAccessImg = document.createElement("img");
                playlistImageInQuickAccessImg.src = "../assets/images/icons/empty-playlist.png";

                try {
                    const response = await fetch(`https://localhost:7219/Playlist/photo?playlistId=${playlist.id}`);
                    if (response.ok) {
                        playlistImageInQuickAccessImg.src = `https://localhost:7219/Playlist/photo?playlistId=${playlist.id}`;
                    }
                } catch (error) {
                }

                playlistImageInQuickAccessDiv.appendChild(playlistImageInQuickAccessImg);
                playlistElement.appendChild(playlistImageInQuickAccessDiv);

                // const playlistNameDiv = document.createElement("div");
                // playlistNameDiv.classList.add("playlist-name");
                // playlistNameDiv.textContent = playlist.title;
                // playlistElement.appendChild(playlistNameDiv);

                playlistElement.addEventListener("click", () => {
                    this.renderSelectedPlaylist(playlist.id, userId);
                });

                return playlistElement;
            });

            const playlistElements = await Promise.all(playlistPromises);
            playlistElements.forEach(playlistElement => playlistList.appendChild(playlistElement));

            playlistsContainer.appendChild(playlistList);
        } catch (error) {
            console.error(error);
        }
    }

    async renderSelectedPlaylist(playlistId, userId) {
        const displayField = document.getElementById("displayField");
    
        try {
            const playlistDiv = document.createElement("div");
            playlistDiv.classList.add("playlist-in-display-field");
    
            const playlistData = await this.getUserPlaylist(playlistId);
            console.log(playlistData);
    
            const playlistInformationDiv = document.createElement("div");
            playlistInformationDiv.classList.add("playlist-information");
    
            const playlistImgDiv = document.createElement("div");
            playlistImgDiv.classList.add("playlist-image");
    
            const playlistImg = document.createElement("img");
            playlistImg.id = "playlist-image";
            playlistImg.src = "../assets/images/icons/empty-playlist.png";
    
            try {
                const response = await fetch(`https://localhost:7219/Playlist/photo?playlistId=${playlistData.playlistId}`);
                if (response.ok) {
                    playlistImg.src = `https://localhost:7219/Playlist/photo?playlistId=${playlistData.playlistId}`;
                }
            } catch (error) {
                console.error(error);
            }
    
            playlistImgDiv.appendChild(playlistImg);
    
            const playlistName = document.createElement("div");
            playlistName.classList.add("playlist-name");
            playlistName.id = "playlist-name";
            playlistName.textContent = playlistData.playlistTitle;
    
            playlistInformationDiv.appendChild(playlistImgDiv);
            playlistInformationDiv.appendChild(playlistName);
    
            playlistInformationDiv.addEventListener("click", () => {
                this.openEditPlaylistModal(playlistInformationDiv, playlistId, userId);
            });
    
            const songsContainer = document.createElement("div");
            songsContainer.id = "songs-container";
            songsContainer.classList.add("container-style");
    
            displayField.innerHTML = "";
    
            playlistDiv.appendChild(playlistInformationDiv);
    
            if (playlistData.songs.$values.length === 0) {
                const emptyPlaylist = document.createElement("div");
                emptyPlaylist.textContent = `Плейлист '${playlistData.playlistTitle}' порожній!`;
    
                playlistDiv.appendChild(emptyPlaylist);
            } else {
                playlistData.songs.$values.forEach(item => {
                    console.log(item);
                    const songDiv = document.createElement("div");
                    songDiv.classList.add("catalog-song");
                    const songId = item.songId;
                    songDiv.setAttribute("data-id", songId);
    
                    const songInformationDiv = document.createElement("div");
                    songInformationDiv.classList.add("catalog-song-information");
    
                    const songPhotoDiv = document.createElement("div");
                    songPhotoDiv.classList.add("catalog-song-photo");
                    const songPhotoImg = document.createElement("img");
    
                    songPhotoImg.src = `https://localhost:7219/Song/photo/${item.photo.id}`;
                    songPhotoImg.alt = "Photo";
                    songPhotoImg.style.maxWidth = "50px";
                    songPhotoImg.style.maxHeight = "50px";
                    songPhotoImg.style.width = "100%";
                    songPhotoImg.style.height = "100%";
                    songPhotoDiv.appendChild(songPhotoImg);
    
                    // Додаємо ім'я та виконавця пісні
                    const songNameDiv = document.createElement("div");
                    songNameDiv.classList.add("catalog-song-name");
                    songNameDiv.textContent = item.songTitle;
    
                    songNameDiv.addEventListener("click", () => {
                        const songClass = new Song();
                        songClass.renderAlbumBySongId(item.songId);
                    });
    
                    const artistDiv = document.createElement("div");
                    artistDiv.classList.add("catalog-artist");
                    artistDiv.textContent = item.artistUsername;
    
                    artistDiv.addEventListener("click", () => {
                        const userProfile = new Profile();
                        userProfile.renderUserProfile(item.artistId);
                    });
    
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
                    durationDiv.textContent = this.formatDuration(item.audios.$values[0].duration);
    
                    // Додаємо кнопку "Відтворити"
                    const playButtonDiv = document.createElement("div");
                    playButtonDiv.classList.add("catalog-play-button");
                    playButtonDiv.textContent = ">";
                    playButtonDiv.addEventListener("click", () => {
                        const player = new Player();
                        player.play(songId);
                    });
    
                    songPlayControlDiv.appendChild(durationDiv);
                    songPlayControlDiv.appendChild(playButtonDiv);
    
                    songDiv.appendChild(songInformationDiv);
                    songDiv.appendChild(songPlayControlDiv);
    
                    songDiv.addEventListener('dblclick', () => {
                        const player = new Player();
                        player.play(songId);
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
                                const player = new Player();
                                player.play(songId);
                            });
    
                            const menuItem2 = document.createElement('div');
                            menuItem2.textContent = 'Видалити з плейлиста';
                            menuItem2.addEventListener('click', () => {
                                this.deleteSongFromPlaylist(playlistId, songId);
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
                playlistDiv.appendChild(songsContainer);
            }
    
            const playlistControlDiv = document.createElement("div");
            playlistControlDiv.classList.add("playlist-control");
    
            const deleteButton = document.createElement("div");
            deleteButton.classList.add("delete-playlist");
            deleteButton.textContent = "Видалити плейлист";
            deleteButton.addEventListener("click", () => {
                this.deletePlaylist(playlistId, userId);
            });
            playlistControlDiv.appendChild(deleteButton);
    
            playlistDiv.appendChild(playlistControlDiv);
    
            displayField.appendChild(playlistDiv);
        } catch (error) {
            console.error(error);
        }
    }
    

    async renderCatalogOfUsersPlaylist(userId) {
        const displayField = document.getElementById("displayField");

        try {
            console.log(userId);
            const playlists = await this.getUserPlaylists(userId);

            displayField.innerHTML = "";

            const catalogPlaylist = document.createElement("div");
            catalogPlaylist.classList.add("catalog-playlist");

            const playlistPromises = playlists.$values.map(async (playlist) => {
                const playlistElement = document.createElement("div");
                playlistElement.classList.add("playlist-in-catalog");

                const playlistImageDiv = document.createElement("div");
                playlistImageDiv.classList.add("playlist-image");

                const playlistImageImg = document.createElement("img");
                playlistImageImg.src = "../../assets/images/icons/empty-playlist.png";

                try {
                    const response = await fetch("https://localhost:7219/Playlist/photo?playlistId=" + playlist.id);
                    if (response.ok) {
                        playlistImageImg.src = "https://localhost:7219/Playlist/photo?playlistId=" + playlist.id;
                    } else {
                        console.error("Помилка завантаження зображення для плейлиста " + playlist.id);
                    }
                } catch (error) {
                    console.error("Помилка завантаження зображення для плейлиста " + playlist.id, error);
                }

                playlistImageDiv.appendChild(playlistImageImg);
                playlistElement.appendChild(playlistImageDiv);

                const playlistNameDiv = document.createElement("div");
                playlistNameDiv.classList.add("playlist-name");
                playlistNameDiv.textContent = playlist.title;

                playlistElement.appendChild(playlistNameDiv);

                playlistElement.addEventListener("click", () => {
                    this.renderSelectedPlaylist(playlist.id);
                });

                return playlistElement;
            });

            const playlistElements = await Promise.all(playlistPromises);
            playlistElements.forEach(playlistElement => catalogPlaylist.appendChild(playlistElement));

            displayField.appendChild(catalogPlaylist);
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
        } catch (error) {
            console.error('Error adding song to playlist:', error);
        }
    }

    async createPlaylist(userId, playlistTitle) {
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
            }

            this.renderUserPlaylistsInQuickAccess(userId);
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

    async deleteSongFromPlaylist(playlistId, songId) {
        try {
            const response = await fetch(`https://localhost:7219/Playlist/${playlistId}/RemoveSong/${songId}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete song from playlist. Status: ${response.status}`);
            }

            this.renderSelectedPlaylist(playlistId);
        } catch (error) {
            console.error('Error deleting song from playlist:', error);
        }
    }

    async deletePlaylist(playlistId, userId) {
        try {
            const response = await fetch(`https://localhost:7219/Playlist/${playlistId}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete playlist. Status: ${response.status}`);
            }

            this.renderUserPlaylistsInQuickAccess(userId);
            console.log(userId);
            this.renderCatalogOfUsersPlaylist(userId);
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    }

    editUserPlaylist(playlistInformationDiv, playlistId, userId) {
        this.openEditPlaylistModal(playlistInformationDiv, playlistId);
    }

    openEditPlaylistModal(playlistInformationDiv, playlistId, userId) {
        const modalEditPlaylistModal = document.getElementById("editProfileModal");

        const editPlaylistModal = document.getElementById("editProfile");
        editPlaylistModal.innerHTML = ``;

        const playlistInformationDivClone = playlistInformationDiv.cloneNode(true);

        // Додаємо обробник подій для зміни username
        const playlistNameDiv = playlistInformationDivClone.querySelector('#playlist-name');
        playlistNameDiv.addEventListener('click', () => {
            const currentPlaylistName = playlistNameDiv.textContent;
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = currentPlaylistName;
            inputField.classList.add('username-input');

            playlistNameDiv.replaceWith(inputField);

            inputField.addEventListener('blur', () => {
                const newUsername = inputField.value;
                playlistNameDiv.textContent = newUsername;
                inputField.replaceWith(playlistNameDiv);
            });

            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    inputField.blur();
                }
            });

            inputField.focus();
        });

        // Додаємо обробник подій для зміни фото
        const playlistPhotoDiv = playlistInformationDivClone.querySelector('.playlist-image img');
        let avatarFile = null;
        playlistPhotoDiv.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.classList.add('photo-input');

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    avatarFile = file;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        playlistPhotoDiv.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

            fileInput.click();
        });

        editPlaylistModal.appendChild(playlistInformationDivClone);

        const okButtonEditPlaylistModal = document.createElement("button");
        okButtonEditPlaylistModal.classList.add("editProfileOkButton");
        okButtonEditPlaylistModal.textContent = "OK";

        const cancelButtonEditPlaylistModal = document.createElement("button");
        cancelButtonEditPlaylistModal.classList.add("editProfileCancelButton");
        cancelButtonEditPlaylistModal.textContent = "Cancel";

        editPlaylistModal.appendChild(okButtonEditPlaylistModal);
        editPlaylistModal.appendChild(cancelButtonEditPlaylistModal);

        modalEditPlaylistModal.style.display = "block";

        cancelButtonEditPlaylistModal.onclick = () => {
            this.closeEditPlaylistModal();
        };

        okButtonEditPlaylistModal.onclick = () => {
            this.updateUserPlaylist(playlistInformationDivClone, playlistId, avatarFile, userId);
            this.closeEditPlaylistModal();
        };
    }

    closeEditPlaylistModal() {
        const modalEditPlaylistModal = document.getElementById("editProfileModal");
        modalEditPlaylistModal.style.display = "none";
    }

    async updateUserPlaylist(playlistInformationDivClone, playlistId, playlistPhotoFile, userId) {
        const playlistNameDiv = playlistInformationDivClone.querySelector('#playlist-name');
        const newPlaylistName = playlistNameDiv.textContent;

        if (!newPlaylistName) {
            return;
        }

        try {
            const response = await fetch(`https://localhost:7219/Playlist/editplaylist?playlistId=${playlistId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPlaylistName)
            });

            if (!response.ok) {
                throw new Error('Failed');
            }

            if (playlistPhotoFile) {
                const formData = new FormData();
                formData.append('photoFile', playlistPhotoFile);
                formData.append('playlistId', playlistId);

                const photoResponse = await fetch(`https://localhost:7219/Playlist/uploadPhoto`, {
                    method: 'POST',
                    body: formData
                });

                if (!photoResponse.ok) {
                    
                }
            }

            this.renderUserPlaylistsInQuickAccess(userId);
            this.renderSelectedPlaylist(playlistId, userId);
        }
        catch (error) {

        }
    }
}

export default Playlist;