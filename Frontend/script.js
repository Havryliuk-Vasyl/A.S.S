import Catalog from './assets/scripts/catalog.js';
import Player from './assets/player/player.js';
import Playlist from './assets/scripts/playlist.js';


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

// Код, який виконується при загрузці всього контенту на сторінці
document.addEventListener("DOMContentLoaded", function () {
    let username = "";
    let userId;
    $.ajax({
        type: "GET",
        url: "https://localhost:7219/User/validateToken",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function (response) {
            console.log("User profile:", response);

            username = response.username;
            userId = response.id;

            document.getElementById('userImage').src = "assets/images/icons/noimageuser.png";
            $.ajax({
                type: "GET",
                url: "https://localhost:7219/User/avatar/" + userId,
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
        openAllPlaylistsImg.classList.add("playlist-control-img");
        openAllPlaylistsImg.src = 'assets/images/icons/openAllPlaylists.png'

        openAllPlaylistsBtn.appendChild(openAllPlaylistsImg);

        playlistControl.appendChild(createPlaylistBtn);
        playlistControl.appendChild(openAllPlaylistsBtn);
        playlistsContainer.appendChild(playlistControl);

        const playlist = new Playlist();
        playlist.renderUserPlaylistsInQuikAccess(userId);
    }

    document.getElementById("profile").addEventListener("click", function () {
        var userProfileURL = 'assets/pages/profile.html';
        window.location.href = userProfileURL;
    });

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

            navigationOnMenu.appendChild(adminPanel);
        }
        else if (user.status === "artist") {
            let navigationOnMenu = document.getElementById("navigation-on-menu");

            let artistPanel = document.createElement("li");
            let linkOnArtistPanel = document.createElement("a");
            linkOnArtistPanel.id = "artistPanel";
            linkOnArtistPanel.innerText = "Панель артиста";
            linkOnArtistPanel.href = "assets/pages/artistPanel.html";

            artistPanel.appendChild(linkOnArtistPanel);

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
});

