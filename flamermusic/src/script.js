import Catalog from './assets/scripts/catalog.js';
import Player from './assets/player/player.js';
import Playlist from './assets/scripts/playlist.js';
import Song from './assets/scripts/album.js';
import Profile from './assets/scripts/profile.js'
import Search from './assets/scripts/search.js';

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
        var search = new Search(); 
        search.renderSearch();
    });

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
