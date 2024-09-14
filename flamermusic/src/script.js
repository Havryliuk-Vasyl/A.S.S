import Catalog from './assets/scripts/catalog.js';
import Player from './assets/player/player.js';
import Playlist from './assets/scripts/playlist.js';
import Song from './assets/scripts/album.js';
import Profile from './assets/scripts/profile.js'

// Модальне вікно для створення плейлиста
var modalCreatePlaylistModal = document.getElementById("createPlaylistModal");
var okButtonCreatePlaylistModal = document.getElementById("createPlaylistOkButton");
var cancelButtonCreatePlaylistModal = document.getElementById("createPlaylistCancelButton");
var inputDataCreatePlaylistModal = document.getElementById("inputData");

function openCreatePlaylistModal() {
    modalCreatePlaylistModal.style.display = "block";
}

function closeCreatePlaylistModal() {
    modalCreatePlaylistModal.style.display = "none";
}

cancelButtonCreatePlaylistModal.onclick = function () {
    closeCreatePlaylistModal();
}

var modalAddSongToPlaylistModal = document.getElementById("addSongToPlaylistModal");
var okButtonAddSongToPlaylistModal = document.getElementById("addSongToPlaylistOkButton");
var cancelButtonAddSongToPlaylistModal = document.getElementById("addSongToPlaylistCancelButton");
var selectAddSongToPlaylistModal = document.getElementById("playlistSelect");

var modalSettingModal = document.getElementById("settingsModal");
var backButtonSettingsModal = document.getElementById("backButton");

var becomeArtistModal = document.getElementById("becomeArtistModal");
var cancelBecomeArtistBtn = document.getElementById("cancelBecomeArtist");
var sendBecomeArtistBtn = document.getElementById("sendBecomeArtist");

async function openSettingsModal(userId) {
    modalSettingModal.style.display = "block";

    const settingsDiv = document.getElementById("settings");
    settingsDiv.innerHTML = ``;

    const user = await new Profile().getUserById(userId);

    if (user.status === "listener") {
        const becomeArtistBtn = document.createElement("button");
        becomeArtistBtn.id = "becomeArtist";
        becomeArtistBtn.textContent = "Стати артистом";

        becomeArtistBtn.addEventListener("click", () => {
            openBecomeArtistModal(user.id);
        });

        settingsDiv.appendChild(becomeArtistBtn);
    }

    const buttonExit = document.createElement("button");
    buttonExit.id = "exit";
    buttonExit.textContent = "Вийти";

    buttonExit.addEventListener("click", function () {
        localStorage.removeItem('token');
        window.location.href = 'assets/pages/authorization.html';
    });

    settingsDiv.appendChild(buttonExit);
}

function closeSettingsModal() {
    modalSettingModal.style.display = "none";
}

backButtonSettingsModal.onclick = () => {
    closeSettingsModal();
}

function openBecomeArtistModal(userId) {
    modalSettingModal.style.display = "none";
    becomeArtistModal.style.display = "block";

    sendBecomeArtistBtn.addEventListener("click", () => {
        const description = document.getElementById("description");
        console.log(description.value);
        var request = {
            id: 0,
            userId: userId,
            description: description.value
        }
        console.log(request);
        becomeArtistSend(request);
    });
}

function closeBecomeArtistModal() {
    becomeArtistModal.style.display = "none";
    modalSettingModal.style.display = "block";
}

cancelBecomeArtistBtn.addEventListener("click", () => {
    closeBecomeArtistModal();
});

async function becomeArtistSend(request) {
    try {
        const response = await fetch(`https://localhost:7219/User/becomeArtist`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok){

        }

        else closeBecomeArtistModal();
    }
    catch (error) {

    }
}

document.addEventListener("DOMContentLoaded", function () {
    let username = "";
    let userId;
    $.ajax({
        type: "GET",
        url: "https://localhost:7219/Authorization/validateToken",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function (response) {
            username = response.username;
            userId = response.id;

            document.getElementById('userImage').src = "assets/images/icons/noimageuser.png";
            $.ajax({
                type: "GET",
                url: "https://localhost:7219/User/avatar/" + userId,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function () {
                    document.getElementById('userImage').src = "https://localhost:7219/User/avatar/" + userId;
                },
                error: function (error) {

                }
            });

            renderUsersFunctionality(response);
            renderMain(response);
        },
        error: function (error) {
            window.location.href = 'assets/pages/authorization.html';
        }
    });

    okButtonAddSongToPlaylistModal.onclick = () => {
        const playlistId = this.selectAddSongToPlaylistModal.value;
        const songId = this.modalAddSongToPlaylistModal.getAttribute("data-song-id");

        this.playlist.addToPlaylist(songId, playlistId);
        this.closeAddSongToPlaylistModal();
    };

    cancelButtonAddSongToPlaylistModal.onclick = () => {
        this.closeAddSongToPlaylistModal();
    };

    const player = new Player();
    const songClass = new Song(userId);
    const playlist = new Playlist();
    const profile = new Profile(userId);

    document.getElementById("profile").addEventListener("click", () => {
        profile.renderPersonalProfile(userId);
    })

    document.getElementById("settingsBtn").addEventListener("click", () => {
        openSettingsModal(userId);
    });

    document.getElementById("catalogBtn").addEventListener("click", function () {
        const catalog = new Catalog(userId);
        catalog.renderRecentSongs();
    });

    document.getElementById("searchBtn").addEventListener("click", function () {
        renderSearch();
    });

    function renderSearch() {
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

        searchButton.addEventListener("click", function () {
            performSearch(searchInput.value, searchResults);
        });
    }

    function performSearch(query, displayField) {
        $.ajax({
            type: "GET",
            url: `https://localhost:7219/Search/all?data=${encodeURIComponent(query)}`,
            headers: {
                'accept': '*/*'
            },
            success: function (response) {
                displaySearchResults(response, displayField);
            },
            error: function (error) {
                console.error("Error during search:", error);
            }
        });
    }

    function displaySearchResults(response, displayField) {
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
                        createSongElement(item, searchSongDiv);
                        break;
                    case 'User':
                        createUserElement(item, usersDiv);
                        break;
                    case 'Album':
                        createAlbumElement(item, searchAlbumDiv);
                        break;
                    default:
                }
            });

        } else {
            searchResults.innerText = "No results found.";
        }
    }


    async function getSong(songId) {
        try {
            const response = await fetch("https://localhost:7219/Song/" + songId);
            if (!response.ok) {
                throw new Error();
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Error during search:", error);
        }
    }

    async function createSongElement(item, searchSongDiv) {
        try {
            const song = await getSong(item.id);

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
            durationDiv.textContent = formatDuration(song.duration);

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

    function createUserElement(item, searchUserDiv) {
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

    function createAlbumElement(item, parentElement) {
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
            songClass.renderAlbumByAlbumId(item.id);
        });

        parentElement.appendChild(albumDiv);
    }


    function createDefaultElement(item) {
        const defaultDiv = document.createElement("div");
        defaultDiv.classList.add("catalog-default");
        defaultDiv.textContent = `Unknown type: ${item.type}`;
        return defaultDiv;
    }

    function renderMain(user) {
        renderPlaylistControl(user.id);

        const catalog = new Catalog(user.id);
        catalog.renderRecentSongs();

        const player = new Player();
        player.renderPlayer();
    }

    function renderPlaylistControl(userId) {
        const playlistsContainer = document.getElementById("playlistsInMain");
        playlistsContainer.innerHTML = ``;
        let playlistControl = document.createElement("div");
        playlistControl.classList.add("playlist-control-btn");

        let createPlaylistBtn = document.createElement("div");
        createPlaylistBtn.classList.add("create-playlist-btn");

        createPlaylistBtn.addEventListener("click", function () {
            openCreatePlaylistModal();
        });

        let createPlaylistImg = document.createElement("img");
        createPlaylistImg.classList.add("playlist-control-img");
        createPlaylistImg.src = 'assets/images/icons/plus_img.png'

        createPlaylistBtn.appendChild(createPlaylistImg);

        let openAllPlaylistsBtn = document.createElement("div");
        openAllPlaylistsBtn.classList.add("open-all-playlists-btn");

        openAllPlaylistsBtn.addEventListener("click", function () {
            playlist.renderCatalogOfUsersPlaylist(userId);
        });

        let openAllPlaylistsImg = document.createElement("img");
        openAllPlaylistsImg.src = 'assets/images/icons/openAllPlaylists.png'
        openAllPlaylistsImg.classList.add("playlist-control-img");

        openAllPlaylistsBtn.appendChild(openAllPlaylistsImg);

        playlistControl.appendChild(createPlaylistBtn);
        playlistControl.appendChild(openAllPlaylistsBtn);
        playlistsContainer.appendChild(playlistControl);

        const playlist = new Playlist();
        playlist.renderUserPlaylistsInQuickAccess(userId);
    }

    function renderUsersFunctionality(user) {
        if (user.status === "administrator") {
            let navigationOnMenu = document.getElementById("navigation-on-menu");

            let adminPanel = document.createElement("li");
            let linkOnAdminPanel = document.createElement("a");
            linkOnAdminPanel.id = "adminPanel";
            linkOnAdminPanel.href = "#";

            let imgAdminPanel = document.createElement("img");
            imgAdminPanel.src = "assets/images/icons/admin-icon.png";

            linkOnAdminPanel.appendChild(imgAdminPanel);
            adminPanel.appendChild(linkOnAdminPanel);

            adminPanel.addEventListener("click", function () {
                window.location.href = "assets/pages/administratorPanel.html"
            })

            navigationOnMenu.appendChild(adminPanel);
        }
        else if (user.status === "artist") {
            let navigationOnMenu = document.getElementById("navigation-on-menu");

            let artistPanel = document.createElement("li");
            let linkOnArtistPanel = document.createElement("a");
            linkOnArtistPanel.id = "adminPanel";
            linkOnArtistPanel.href = "#";

            let imgAdminPanel = document.createElement("img");
            imgAdminPanel.src = "assets/images/icons/artist-panel.png";

            linkOnArtistPanel.appendChild(imgAdminPanel);
            artistPanel.appendChild(linkOnArtistPanel);

            artistPanel.addEventListener("click", () => {
                window.location.href = "assets/pages/artistPanel.html";
            });
            navigationOnMenu.appendChild(artistPanel);
        }
    }

    okButtonCreatePlaylistModal.onclick = function () {
        var title = inputDataCreatePlaylistModal.value;

        const playlist = new Playlist();

        playlist.createPlaylist(userId, title);

        closeCreatePlaylistModal();
        renderPlaylistControl(userId);
    }

    function formatDuration(durationInSeconds) {
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

    async function openAddSongToPlaylistModal(sondId) {
        modalAddSongToPlaylistModal.style.display = "block";
        modalAddSongToPlaylistModal.setAttribute("data-song-id", sondId);

        selectAddSongToPlaylistModal.innerHTML = "";

        try {
            const playlists = await playlist.getUserPlaylists(userId);
            for (const playlist of playlists.$values) {
                const option = document.createElement('option');
                option.value = playlist.id;
                option.text = playlist.title;
                selectAddSongToPlaylistModal.appendChild(option);
            }
        } catch (error) {
            console.error('Error retrieving playlists:', error);
        }
    }

    async function becomeArtist(userId) {

    }
});
