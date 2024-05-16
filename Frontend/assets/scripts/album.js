import Player from "../player/player.js";
import Playlist from "./playlist.js";

class Song {
    constructor(userId) {
        this.modalAddSongToPlaylistModal = document.getElementById("addSongToPlaylistModal");
        this.okButtonAddSongToPlaylistModal = document.getElementById("addSongToPlaylistOkButton");
        this.cancelButtonAddSongToPlaylistModal = document.getElementById("addSongToPlaylistCancelButton");
        this.selectAddSongToPlaylistModal = document.getElementById("playlistSelect");

        this.includeStyles();
        this.player = new Player();
        this.playlist = new Playlist();
        this.userId = userId;

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

    includeStyles(){
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
        try{
            const response = await fetch(`https://localhost:7219/Album/songs/` + songId);
            if (!response.ok){
                throw new Error("Error");
            }
            const data = await response.json();
            return data;
        }
        catch (error){
            throw error;
        }
    }

    async renderAlbumBySongId(songId){
        try {
            const album = await this.getAlbumBySongId(songId);
            this.renderAlbum(album);
        }
        catch(error){
            throw new Error(error);
        }
    }

    renderAlbum(album) {
        const displayField = document.getElementById("displayField");
        displayField.innerHTML = '';
    
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album-in-display-field");
    
        const albumInfo = document.createElement("div");
        albumInfo.classList.add("albumInfo");
    
        const albumTitle = document.createElement('h2');
        albumTitle.textContent = album.title;
        albumInfo.appendChild(albumTitle);
    
        const albumPhoto = document.createElement('img');
        albumPhoto.src = "https://localhost:7219/Album/photo/" + album.id;
        albumInfo.appendChild(albumPhoto);
    
        const songsList = document.createElement('div');
        const renderSongs = async () => {
            for (const item of album.albumSongs.$values) {
                const songDiv = document.createElement("div");
                songDiv.classList.add("album-song");
    
                const songInformationDiv = document.createElement("div");
                songInformationDiv.classList.add("album-song-information");
    
                const songPhotoDiv = document.createElement("div");
                songPhotoDiv.classList.add("album-song-photo");
                const songPhotoImg = document.createElement("img");
                
                try {
                    const response = await fetch("https://localhost:7219/Song/photo/" + item.song.id);
                    if (!response.ok) {
                        throw new Error("Failed to fetch song photo");
                    }
                    const photoBlob = await response.blob();
                    const photoUrl = URL.createObjectURL(photoBlob);
                    songPhotoImg.src = photoUrl;
                } catch (error) {
                    console.error(error);
                    songPhotoImg.src = "placeholder.jpg"; // Встановіть шлях до плейсхолдера або іншого за замовчуванням
                }
    
                songPhotoImg.alt = "Photo";
                songPhotoImg.style.maxWidth = "50px";
                songPhotoImg.style.maxHeight = "50px";
                songPhotoImg.style.width = "100%";
                songPhotoImg.style.height = "100%";
                songPhotoDiv.appendChild(songPhotoImg);
    
                const songNameDiv = document.createElement("div");
                songNameDiv.classList.add("catalog-song-name");
                songNameDiv.textContent = item.song.title;
    
                const songPlayControlDiv = document.createElement("div");
                songPlayControlDiv.classList.add("catalog-song-play-control");

                const durationDiv = document.createElement("div");
                durationDiv.classList.add("catalog-duration");
                console.log(item);
                durationDiv.textContent = this.formatDuration(item.duration);

                const playButtonDiv = document.createElement("div");
                playButtonDiv.classList.add("catalog-play-button");
                playButtonDiv.textContent = ">";

                playButtonDiv.addEventListener("click", () => {
                    this.player.play(item.song.id);
                });

                songPlayControlDiv.appendChild(durationDiv);
                songPlayControlDiv.appendChild(playButtonDiv);

                songInformationDiv.appendChild(songPhotoDiv);
                songInformationDiv.appendChild(songNameDiv);
                songDiv.appendChild(songInformationDiv);
                songDiv.appendChild(songPlayControlDiv);
    
                songsList.appendChild(songDiv);
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
}

export default Song;