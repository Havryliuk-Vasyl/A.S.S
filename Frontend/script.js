import Catalog from './assets/scripts/catalog.js';
import Player from './assets/player/player.js';
import Playlist from './assets/scripts/playlist.js';

document.addEventListener("DOMContentLoaded", function() {
    let username = "";
    $.ajax({
        type: "GET",
        url: "https://localhost:7219/User/validateToken",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
            console.log("User profile:", response);

            username = response.username;
            
            const profileUsername = document.getElementById('profile-username');

            renderUsersFunctionality(response);
            
            profileUsername.textContent = username;
        },
        error: function(error) {
            window.location.href = 'assets/pages/authorization.html';
        }
    });

    const playlist = new Playlist();
    playlist.renderUserPlaylist();

    const catalog = new Catalog();
    catalog.renderRecentSongs();

    const player = new Player();
    player.renderPlayer();
    
    document.getElementById("profile").addEventListener("click", function(){
        if (document.getElementById("profile-username").textContent == "Назад") {
            document.getElementById("pageFrame").src = catalogURL;
            document.getElementById("profile-username").innerText = username;
        }
        else{
            var userProfileURL = 'assets/pages/profile.html';
            window.location.href = userProfileURL;
        }
    });

    function renderUsersFunctionality(user){
        if (user.status === "administrator"){
            let navigationOnMenu = document.getElementById("navigation-on-menu");
            
            let adminPanel = document.createElement("li");
            let linkOnAdminPanel = document.createElement("a");
            linkOnAdminPanel.id = "adminPanel";
            linkOnAdminPanel.innerText="Панель адміна";
            linkOnAdminPanel.href = "#";

            adminPanel.appendChild(linkOnAdminPanel);
            
            navigationOnMenu.appendChild(adminPanel);
        }
        else if (user.status === "artist"){
            let navigationOnMenu = document.getElementById("navigation-on-menu");
            
            let artistPanel = document.createElement("li");
            let linkOnArtistPanel = document.createElement("a");
            linkOnArtistPanel.id = "artistPanel";
            linkOnArtistPanel.innerText="Панель артиста";
            linkOnArtistPanel.href = "assets/pages/uploadAudio.html";

            artistPanel.appendChild(linkOnArtistPanel);
            
            navigationOnMenu.appendChild(artistPanel);
        }
    }
});

