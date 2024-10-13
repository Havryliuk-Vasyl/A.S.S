import Song from "../scripts/album.js";

class Search{
    constructor(){

    }
    renderSearch() {
        const displayField = document.getElementById("displayField");
        displayField.innerHTML = '';

        let searchContainer = document.createElement("div");
        searchContainer.classList.add("search-container");

        let searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.id = "searchInput";
        searchInput.placeholder = "Введіть пошуковий запит";
        searchContainer.appendChild(searchInput);

        let searchButton = document.createElement("button");
        searchButton.id = "searchButton";
        searchButton.innerText = "Шукати";
        searchContainer.appendChild(searchButton);

        let searchDiv = document.createElement("div");
        searchDiv.classList.add("search-div");
        searchDiv.appendChild(searchContainer);

        let searchResults = document.createElement("div");
        searchResults.id = "searchResults";
        searchDiv.appendChild(searchResults);

        displayField.appendChild(searchDiv);

        searchButton.addEventListener("click", () => {
            this.performSearch(searchInput.value, searchResults);
        });
    }

    performSearch(query, displayField) {
        $.ajax({
            type: "GET",
            url: `https://localhost:7219/Search/all?data=${encodeURIComponent(query)}`,
            headers: {
                'accept': '*/*'
            },
            success: (response) => {
                this.displaySearchResults(response.data, displayField);
            },
            error: (error) => {
                console.error("Error during search:", error);
            }
        });
    }

    displaySearchResults(response, displayField) {
        const searchResults = document.getElementById("searchResults");
        searchResults.innerHTML = '';

        const searchSongDiv = document.createElement("div");
        searchSongDiv.classList.add("search-song");

        const resInfo = document.createElement("div");
        resInfo.classList.add("result-info");
        const resInfoType = document.createElement("div");
        resInfoType.classList.add("result-info-type");
        resInfoType.textContent = "Пісні";
        resInfo.appendChild(resInfoType);
        // const resInfoShowMore = document.createElement("div");
        // resInfoShowMore.classList.add("result-info-show-more");
        // resInfoShowMore.textContent = "Показати більше..";
        // resInfo.appendChild(resInfoShowMore);
        //searchSongDiv.appendChild(resInfo);

        const searchAlbumDiv = document.createElement("div");
        searchAlbumDiv.classList.add("search-album");

        const resAlbumInfo = document.createElement("div");
        resAlbumInfo.classList.add("result-info");
        const resAlbumInfoType = document.createElement("div");
        resAlbumInfoType.classList.add("result-info-type");
        resAlbumInfoType.textContent = "Альбоми";
        resAlbumInfo.appendChild(resAlbumInfoType);
        // const resAlbumInfoShowMore = document.createElement("div");
        // resAlbumInfoShowMore.classList.add("result-info-show-more");
        // resAlbumInfoShowMore.textContent = "Показати більше..";
        // resAlbumInfo.appendChild(resAlbumInfoShowMore);
        //searchAlbumDiv.appendChild(resAlbumInfo);
        const albumsDiv = document.createElement("div");
        albumsDiv.classList.add("albums-div");

        const searchUserDiv = document.createElement("div");
        searchUserDiv.classList.add("search-user");

        const searchUserInfo = document.createElement("div");
        searchUserInfo.classList.add("result-info");
        const resUserType = document.createElement("div");
        resUserType.classList.add("result-info-type");
        resUserType.textContent = "Користувачі";
        searchUserInfo.appendChild(resUserType);
        // const resUserInfoShowMore = document.createElement("div");
        // resUserInfoShowMore.classList.add("result-info-show-more");
        // resUserInfoShowMore.textContent = "Показати більше..";
        // searchUserInfo.appendChild(resUserInfoShowMore);
        const usersDiv = document.createElement("div");
        usersDiv.classList.add("user-div");
        
        //searchUserDiv.appendChild(searchUserInfo);
        searchUserDiv.appendChild(usersDiv);

        displayField.appendChild(searchSongDiv);
        displayField.appendChild(searchAlbumDiv);
        displayField.appendChild(searchUserDiv);

        if (response && response.$values) {
            const resultElements = response.$values.map(item => {
                switch (item.type) {
                    case 'Song':
                        this.createSongElement(item, searchSongDiv);
                        break;
                    case 'User':
                        this.createUserElement(item, usersDiv);
                        break;
                    case 'Album':
                        this.createAlbumElement(item, searchAlbumDiv);
                        break;
                    default:
                }
            });

        } else {
            searchResults.innerText = "No results found.";
        }
    }
    async getSong(songId) {
        try {
            const response = await fetch("https://localhost:7219/Song/" + songId);
            if (!response.ok) {
                throw new Error();
            }
            const data = await response.json();
            return data.data;
        }
        catch (error) {
            console.error("Error during search:", error);
        }
    }

    async createSongElement(item, searchSongDiv) {
        try {
            const song = await this.getSong(item.id);

            const songDiv = document.createElement("div");
            songDiv.classList.add("catalog-song");
            songDiv.setAttribute("data-id", item.id);

            const songInformationDiv = document.createElement("div");
            songInformationDiv.classList.add("catalog-song-information");

            const songPhotoDiv = document.createElement("div");
            songPhotoDiv.classList.add("catalog-song-photo");
            const songPhotoImg = document.createElement("img");
            songPhotoImg.src = "https://localhost:7219/Song/photo/" + item.id;
            songPhotoImg.alt = "Photo";
            songPhotoImg.style.maxWidth = "50px";
            songPhotoImg.style.maxHeight = "50px";
            songPhotoImg.style.width = "100%";
            songPhotoImg.style.height = "100%";
            songPhotoDiv.appendChild(songPhotoImg);

            const songNameDiv = document.createElement("div");
            songNameDiv.classList.add("catalog-song-name");
            songNameDiv.textContent = song.title;
            songNameDiv.addEventListener("click", () => {
                songClass.renderAlbumBySongId(song.id);
            });

            const artistDiv = document.createElement("div");
            artistDiv.classList.add("catalog-artist");
            artistDiv.textContent = song.artistName;
            artistDiv.addEventListener("click", () => {
                profile.renderUserProfile(song.artistId);
            });

            songInformationDiv.appendChild(songPhotoDiv);
            songInformationDiv.appendChild(songNameDiv);
            songInformationDiv.appendChild(artistDiv);

            const songPlayControlDiv = document.createElement("div");
            songPlayControlDiv.classList.add("catalog-song-play-control");

            const durationDiv = document.createElement("div");
            durationDiv.classList.add("catalog-duration");
            durationDiv.textContent = this.formatDuration(song.duration);

            const playButtonDiv = document.createElement("div");
            playButtonDiv.classList.add("catalog-play-button");
            playButtonDiv.textContent = ">";

            playButtonDiv.addEventListener("click", () => {
                player.play(song.id);
            });

            songPlayControlDiv.appendChild(durationDiv);
            songPlayControlDiv.appendChild(playButtonDiv);

            songDiv.appendChild(songInformationDiv);
            songDiv.appendChild(songPlayControlDiv);

            songDiv.addEventListener('dblclick', () => {
                player.play(song.id);
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
                        player.play(song.id);
                    });

                    const menuItem2 = document.createElement('div');
                    menuItem2.textContent = 'Додати в плейлист';
                    menuItem2.addEventListener('click', () => {
                        openAddSongToPlaylistModal(song.id);
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

            searchSongDiv.appendChild(songDiv);
        } catch (error) {
            console.error("Error while creating song element:", error);
        }
    }
    createUserElement(item, searchUserDiv) {
        console.log(item);
        const userDiv = document.createElement("div");
        userDiv.classList.add("catalog-user");
        userDiv.setAttribute("data-id", item.id);
    
        const userInformationDiv = document.createElement("div");
        userInformationDiv.classList.add("catalog-user-information");
    
        const photoDiv = document.createElement('div');
        photoDiv.classList.add('album-photo');
        const image = document.createElement('img');
        image.src = "https://localhost:7219/User/avatar/" + item.id;
        photoDiv.appendChild(image);
        userDiv.appendChild(photoDiv);

        const userNameDiv = document.createElement("div");
        userNameDiv.classList.add("catalog-user-name");
        userNameDiv.textContent = item.name;
        userInformationDiv.appendChild(userNameDiv);
    
        userDiv.appendChild(userInformationDiv);
        
        userDiv.addEventListener('click', () => {
            const userProfile = new Profile();
            userProfile.renderUserProfile(item.id); 
        });
    
        searchUserDiv.appendChild(userDiv);
    }

    createAlbumElement(item, parentElement) {
        const albumDiv = document.createElement('div');
        albumDiv.classList.add('album');

        const photoDiv = document.createElement('div');
        photoDiv.classList.add('album-photo');
        const image = document.createElement('img');
        image.src = "https://localhost:7219/Album/photo/" + item.id;
        photoDiv.appendChild(image);
        albumDiv.appendChild(photoDiv);

        const titleDiv = document.createElement('div');
        titleDiv.classList.add('album-title');
        titleDiv.textContent = item.name;
        albumDiv.appendChild(titleDiv);

        albumDiv.addEventListener("click", function () {
            var songClass = new Song();
            songClass.renderAlbumByAlbumId(item.id);
        });

        parentElement.appendChild(albumDiv);
    }

    createDefaultElement(item) {
        const defaultDiv = document.createElement("div");
        defaultDiv.classList.add("catalog-default");
        defaultDiv.textContent = `Unknown type: ${item.type}`;
        return defaultDiv;
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

export default Search;