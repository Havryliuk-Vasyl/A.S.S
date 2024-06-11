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

        if (user.status == "artist") {
            this.renderUsersAlbums(user.id, userProfileDiv);
        }

        userProfileDiv.appendChild(profileInformationDiv);

        displayField.appendChild(userProfileDiv);
    }

    async renderPersonalProfile(userId) {
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
        usernameDiv.id = "username";
        usernameDiv.innerText = user.username;

        const statusDiv = document.createElement("div");
        statusDiv.classList.add("status");
        statusDiv.innerText = user.status;

        userInfoDiv.appendChild(usernameDiv);
        userInfoDiv.appendChild(statusDiv);

        profileInformationDiv.appendChild(profilePhoto);
        profileInformationDiv.appendChild(userInfoDiv);

        profileInformationDiv.addEventListener("click", () => {
            this.editUserProfile(profileInformationDiv, userId);
        });

        if (user.status == "artist") {
            this.renderUsersAlbums(user.id, userProfileDiv);
        }

        userProfileDiv.appendChild(profileInformationDiv);

        displayField.appendChild(userProfileDiv);
    }

    async getUserAlbums(userId) {
        try {
            const response = await fetch(`https://localhost:7219/Album/artist/` + userId);
            if (!response.ok) {
                throw new Error("Albums Not Found");
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.log(error);
        }
    }

    async renderUsersAlbums(userId, userProfile) {
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

            albumDiv.addEventListener("click", () => {
                const songClass = new Song();
                songClass.renderAlbumByAlbumId(album.id);
            });

            albumsDiv.appendChild(albumDiv);
        });

        userProfile.appendChild(albumsDiv);
    }

    editUserProfile(profileInformationDiv, userId) {
        this.openEditProfileModal(profileInformationDiv, userId);
    }

    openEditProfileModal(profileInformationDiv, userId) {
        const modalEditProfileModal = document.getElementById("editProfileModal");

        const editProfileModal = document.getElementById("editProfile");
        editProfileModal.innerHTML = ``;

        const profileInformationDivClone = profileInformationDiv.cloneNode(true);

        // Додаємо обробник подій для зміни username
        const usernameDiv = profileInformationDivClone.querySelector('#username');
        usernameDiv.addEventListener('click', () => {
            const currentUsername = usernameDiv.textContent;
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = currentUsername;
            inputField.classList.add('username-input');

            usernameDiv.replaceWith(inputField);

            inputField.addEventListener('blur', () => {
                const newUsername = inputField.value;
                usernameDiv.textContent = newUsername;
                inputField.replaceWith(usernameDiv);
            });

            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    inputField.blur();
                }
            });

            inputField.focus();
        });

        // Додаємо обробник подій для зміни фото
        const profilePhotoDiv = profileInformationDivClone.querySelector('.profile-photo img');
        let avatarFile = null;
        profilePhotoDiv.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.classList.add('photo-input');

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    avatarFile = file;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        profilePhotoDiv.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

            fileInput.click();
        });

        editProfileModal.appendChild(profileInformationDivClone);

        const okButtonEditProfileModal = document.createElement("button");
        okButtonEditProfileModal.classList.add("editProfileOkButton");
        okButtonEditProfileModal.textContent = "OK";

        const cancelButtonEditProfileModal = document.createElement("button");
        cancelButtonEditProfileModal.classList.add("editProfileCancelButton");
        cancelButtonEditProfileModal.textContent = "Cancel";

        editProfileModal.appendChild(okButtonEditProfileModal);
        editProfileModal.appendChild(cancelButtonEditProfileModal);

        modalEditProfileModal.style.display = "block";

        cancelButtonEditProfileModal.onclick = () => {
            this.closeEditProfileModal();
        };

        okButtonEditProfileModal.onclick = () => {
            this.updateUserProfile(profileInformationDivClone, userId, avatarFile);
            this.closeEditProfileModal();
        };
    }

    async updateUserProfile(profileInformationDivClone, userId, avatarFile) {
        const usernameDiv = profileInformationDivClone.querySelector('#username');
        const newNickname = usernameDiv.textContent;
        
        if (!newNickname) {
            console.error("New username is empty");
            return;
        }
    
        try {
            const response = await fetch(`https://localhost:7219/User/edituser?userId=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newNickname)
            });
    
            if (!response.ok) {
                throw new Error('Failed to update username');
            }

            if (avatarFile) {
                const formData = new FormData();
                formData.append('avatar', avatarFile);
                formData.append('userId', userId);
    
                const avatarResponse = await fetch(`https://localhost:7219/User/uploadAvatar`, {
                    method: 'POST',
                    body: formData
                });
    
                if (!avatarResponse.ok) {
                    throw new Error('Failed to upload avatar');
                }
                document.getElementById('userImage').src = "https://localhost:7219/User/avatar/" + userId;
            }
    
            this.closeEditProfileModal();
            this.renderPersonalProfile(userId);
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    }
    

    closeEditProfileModal() {
        const modalEditProfileModal = document.getElementById("editProfileModal");
        modalEditProfileModal.style.display = "none";
    }
}

export default Profile;
