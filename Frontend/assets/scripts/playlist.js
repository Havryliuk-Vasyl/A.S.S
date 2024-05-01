class Playlist {
    constructor() {
        this.includeStyles();
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
            const response = await fetch(`https://localhost:7219/Playlist/${playlistId}`);
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

    async renderUserPlaylists(userId) {
        const playlistsContainer = document.getElementById("playlistsInMain");
        try {
            const playlists = await this.getUserPlaylists(userId);
            playlists.$values.forEach(playlist => {
                const playlistElement = document.createElement("div");
                playlistElement.classList.add("playlist");
                playlistElement.innerHTML = `
                    <div class="playlist-photo"></div>
                    <div class="playlist-name">${playlist.title}</div>
                `;
                playlistsContainer.appendChild(playlistElement);
            });
        } catch (error) {
            console.error(error);
        }
    }

    renderSelectedPlaylist(playlist) {
        const selectedPlaylistContainer = document.getElementById("selectedPlaylist");
        selectedPlaylistContainer.innerHTML = '';

        const playlistElement = document.createElement("div");
        playlistElement.classList.add("selected-playlist");
        playlistElement.innerHTML = `
            <h3>${playlist.$values[0].title}</h3>
            <ul>
                ${playlist.$values[0].playlistSongs.$values.map(song => `<li>${song.title}</li>`).join('')}
            </ul>
        `;
        selectedPlaylistContainer.appendChild(playlistElement);
    }

    addToPlaylist(songId, playlistId) {

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
    
}

export default Playlist;
