import Song from "./album.js";

class Profile {
    constructor() {
        this.includeStyles();
    }

    includeStyles() {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "../assets/styles/profile.css";
        document.head.appendChild(link);
    }

    async getUserById(userId) {
        try {
            const response = await fetch(`https://localhost:7219/User/id/` + userId);
            if (!response.ok) {
                throw new Error("User Not Found");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
        }
    }

    async renderUserProfile(userId) {
        const displayField = document.getElementById("displayField");
        if (!displayField) {
            console.error("Display field not found");
            return;
        }
        displayField.innerHTML = '';

        const userProfileDiv = document.createElement("div");
        userProfileDiv.classList.add("user-profile");

        const user = await this.getUserById(userId);
        if (!user) {
            console.error("User data not found");
            return;
        }

        const profileInformationDiv = document.createElement("div");
        profileInformationDiv.classList.add("profile-information");

        const profilePhoto = document.createElement("div");
        profilePhoto.classList.add("profile-photo"); 

        const profileAvatar = document.createElement("img");
        profileAvatar.classList.add("profile-avatar");
        profileAvatar.src = "https://localhost:7219/User/avatar/" + user.id;

        profilePhoto.appendChild(profileAvatar);

        const userInfoDiv = document.createElement("div");
        userInfoDiv.classList.add("user-info");

        const usernameDiv = document.createElement("div");
        usernameDiv.classList.add("username");
        usernameDiv.innerText = user.username;

        const statusDiv = document.createElement("div");
        statusDiv.classList.add("status");
        statusDiv.innerText = user.status;

        userInfoDiv.appendChild(usernameDiv);
        userInfoDiv.appendChild(statusDiv);

        profileInformationDiv.appendChild(profilePhoto);
        profileInformationDiv.appendChild(userInfoDiv);

        if (user.status == "artist"){
            this.renderUsersAlbums(user.id, userProfileDiv);
        }

        userProfileDiv.appendChild(profileInformationDiv);

        displayField.appendChild(userProfileDiv);
    }

    renderPersonalProfile() {
        // Implement this method if needed
    }

    async getUserAlbums(userId){
        try{
            const response = await fetch(`https://localhost:7219/Album/artist/` + userId);
            if (!response.ok) {
                throw new Error("Albums Not Found");
            }
            const data = await response.json();
            return data;
        }
        catch(error){
            console.log(error);
        }
    }

    async renderUsersAlbums(userId, userProfile){
        const albumsDiv = document.createElement("div");
        albumsDiv.classList.add("user-albums");

        const albums = await this.getUserAlbums(userId);

        albums.$values.forEach(album => {
            const albumDiv = document.createElement('div');
            albumDiv.classList.add('album');

            const photoDiv = document.createElement('div');
            photoDiv.classList.add('album-photo');
            const image = document.createElement('img');
            image.src = "https://localhost:7219/Album/photo/" + album.id;
            photoDiv.appendChild(image);
            albumDiv.appendChild(photoDiv);

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('album-title');
            titleDiv.textContent = album.title;
            albumDiv.appendChild(titleDiv);
            
            albumDiv.addEventListener("click", () =>{
                const songClass = new Song();
                songClass.renderAlbumByAlbumId(album.id);
            });

            albumsDiv.appendChild(albumDiv);
        });

        userProfile.appendChild(albumsDiv);
    }
}

export default Profile;
