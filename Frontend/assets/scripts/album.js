import Player from "../player/player.js";
import Playlist from "./playlist.js";
import Profile from "./profile.js";

class Song {
    constructor() {
        this.modalAddSongToPlaylistModal = document.getElementById("addSongToPlaylistModal");
        this.okButtonAddSongToPlaylistModal = document.getElementById("addSongToPlaylistOkButton");
        this.cancelButtonAddSongToPlaylistModal = document.getElementById("addSongToPlaylistCancelButton");
        this.selectAddSongToPlaylistModal = document.getElementById("playlistSelect");

        this.includeStyles();
        this.player = new Player();
        this.playlist = new Playlist();

        this.okButtonAddSongToPlaylistModal.onclick = () => {
            const playlistId = this.selectAddSongToPlaylistModal.value;
            const songId = this.modalAddSongToPlaylistModal.getAttribute("data-song-id");

            this.playlist.addToPlaylist(songId, playlistId);
            this.closeAddSongToPlaylistModal();
        };

        this.cancelButtonAddSongToPlaylistModal.onclick = () => {
            this.closeAddSongToPlaylistModal();
        };
    }

    includeStyles() {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "../assets/styles/album.css";
        document.head.appendChild(link);
    }

    async getAlbumByAlbumId(albumID) {
        try {
            const response = await fetch(`https://localhost:7219/Album/album/` + albumID);
            if (!response.ok) {
                throw new Error("Error");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async renderAlbumByAlbumId(albumID) {
        try {
            const album = await this.getAlbumByAlbumId(albumID);
            this.renderAlbum(album);
        } catch (error) {
            console.error(error);
            alert("Error while rendering artist album!");
        }
    }

    async getAlbumBySongId(songId) {
        try {
            const response = await fetch(`https://localhost:7219/Album/songs/` + songId);
            if (!response.ok) {
                throw new Error("Error");
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            throw error;
        }
    }

    async renderAlbumBySongId(songId) {
        try {
            const album = await this.getAlbumBySongId(songId);
            this.renderAlbum(album);
        }
        catch (error) {
            throw new Error(error);
        }
    }

    renderAlbum(albumData) {
        console.log(albumData);
        const displayField = document.getElementById("displayField");
        displayField.innerHTML = '';

        const album = albumData.album;
        const artistUsername = albumData.artistUsername;

        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album-in-display-field");

        const albumInfo = document.createElement("div");
        albumInfo.classList.add("albumInfo");

        const albumPhoto = document.createElement('img');
        albumPhoto.src = "https://localhost:7219/Album/photo/" + album.id;
        albumInfo.appendChild(albumPhoto);

        const albumTitleAndArtistDiv = document.createElement("div");
        albumTitleAndArtistDiv.classList.add("album-title-and-artist");

        const albumTitle = document.createElement('h1');
        albumTitle.classList.add("album-title");
        albumTitle.textContent = album.title;
        albumTitleAndArtistDiv.appendChild(albumTitle);

        const albumArtist = document.createElement('h4');
        albumArtist.classList.add("album-artist");
        albumArtist.textContent = artistUsername;
        albumArtist.addEventListener("click", async () => {
            const profileClass = new Profile(); // Тут відкладений виклик Profile
            await profileClass.renderUserProfile(albumData.artistId);
        });

        const dateShared = document.createElement('h5');
        dateShared.classList.add("date-shared");
        dateShared.textContent = album.dateShared;

        albumTitleAndArtistDiv.appendChild(albumTitle);
        albumTitleAndArtistDiv.appendChild(albumArtist);
        albumTitleAndArtistDiv.appendChild(dateShared);

        albumInfo.appendChild(albumTitleAndArtistDiv);

        const songsList = document.createElement('div');
        songsList.classList.add("songs-list");
        let i = 0;
        const renderSongs = async () => {
            for (const item of album.albumSongs.$values) {
                i++;

                const songDiv = document.createElement("div");
                songDiv.classList.add("album-song");

                const songInformationDiv = document.createElement("div");
                songInformationDiv.classList.add("album-song-information");

                const numberSong = document.createElement("div");
                numberSong.classList.add("number-song");
                numberSong.textContent = i;
                songInformationDiv.appendChild(numberSong);

                const songNameDiv = document.createElement("div");
                songNameDiv.classList.add("album-song-name");
                songNameDiv.textContent = item.song.title;
                songInformationDiv.appendChild(songNameDiv);

                const songPlayControlDiv = document.createElement("div");
                songPlayControlDiv.classList.add("catalog-song-play-control");

                const durationDiv = document.createElement("div");
                durationDiv.classList.add("catalog-duration");
                durationDiv.textContent = this.formatDuration(item.song.duration || 0);
                songPlayControlDiv.appendChild(durationDiv);

                const playButtonDiv = document.createElement("div");
                playButtonDiv.classList.add("album-play-button");
                playButtonDiv.textContent = ">";

                playButtonDiv.addEventListener("click", () => {
                    this.player.play(item.song.id);
                });

                songPlayControlDiv.appendChild(playButtonDiv);

                songDiv.appendChild(songInformationDiv);
                songDiv.appendChild(songPlayControlDiv);

                songDiv.addEventListener('dblclick', () => {
                    this.player.play(item.song.id);
                });

                songsList.appendChild(songDiv);

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
                            this.openAddSongToPlaylistModal(item.song.id);
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
            }
        };

        renderSongs();

        albumDiv.appendChild(albumInfo);
        albumDiv.appendChild(songsList);

        displayField.appendChild(albumDiv);
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

    async openAddSongToPlaylistModal(sondId) {
        this.modalAddSongToPlaylistModal.style.display = "block";
        this.modalAddSongToPlaylistModal.setAttribute("data-song-id", sondId);

        this.selectAddSongToPlaylistModal.innerHTML = "";

        try {
            const playlists = await this.playlist.getUserPlaylists(this.userId);
            for (const playlist of playlists.$values) {
                const option = document.createElement('option');
                option.value = playlist.id;
                option.text = playlist.title;
                this.selectAddSongToPlaylistModal.appendChild(option);
            }
        } catch (error) {
            console.error('Error retrieving playlists:', error);
        }
    }

    closeAddSongToPlaylistModal() {
        this.modalAddSongToPlaylistModal.style.display = "none";
    }
}

export default Song;
