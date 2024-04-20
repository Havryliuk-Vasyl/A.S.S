document.addEventListener("DOMContentLoaded", function() {
    username = "";
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

    $.ajax({
        type: "GET",
        url: "assets/scripts/catalog.js",
        success: function(response) {
            // Створюємо елемент <script>
            var scriptElement = document.createElement("script");
            // Встановлюємо вміст отриманого скрипту
            scriptElement.innerHTML = response;
            // Додаємо елемент <script> до DOM
            document.getElementById("catalog").appendChild(scriptElement);
        },
        error: function(error) {
            console.error("Помилка при отриманні скрипту catalog.js:", error);
        }
    });
    
    document.getElementById("profile").addEventListener("click", function(){
        if (document.getElementById("profile-username").textContent == "Назад") {
            document.getElementById("pageFrame").src = catalogURL;
            document.getElementById("profile-username").innerText = username;
        }
        else{
            var userProfileURL = "assets/pages/profile.html";
            document.getElementById("pageFrame").src = userProfileURL;
            document.getElementById("profile-username").innerText = "Назад";
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

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainderSeconds < 10 ? '0' + remainderSeconds : remainderSeconds;
    return `${minutes}:${formattedSeconds}`;
}

function play(songId){
    const apiUrl = `https://localhost:7219/api/AudioStreaming/audio/${songId}`;
    axios.get(apiUrl, {
        responseType: 'arraybuffer'
    })
    .then(response => {
        const audioData = response.data;
        const audioUrl = URL.createObjectURL(new Blob([audioData]));
    
        const audioElement = document.getElementById('audioPlayer');
    
        audioElement.src = audioUrl;
    
        audioElement.play();
    })
    .catch(error => {
        console.error('Error fetching audio file:', error);
    });
}