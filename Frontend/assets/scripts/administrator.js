//import Song from './album.js';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('editingAccounts').addEventListener('click', loadUsers);
    document.getElementById('requestProccessing').addEventListener('click', loadRequests);

    async function loadUsers() {
        const response = await fetch('https://localhost:7219/Admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            console.error('Failed to load users');
        }
    }

    function displayUsers(users) {
        const displayField = document.getElementById('displayField');
        displayField.innerHTML = '<h2>Users</h2>';

        const usersDiv = document.createElement('div');
        usersDiv.classList.add("users-list");

        users.$values.forEach(user => {
            usersDiv.appendChild(renderUserCard(user));
        });

        displayField.appendChild(usersDiv);
    }

    function renderUserCard(user) {
        const userCardDiv = document.createElement("div");
        userCardDiv.classList.add("user-card");

        const userPhotoDiv = document.createElement("div");
        userPhotoDiv.classList.add("user-photo");

        const userPhotoImg = document.createElement("img");
        userPhotoImg.classList.add("user-avatar");
        userPhotoImg.src = "https://localhost:7219/User/avatar/" + user.id;

        userPhotoDiv.appendChild(userPhotoImg);

        const userIdDiv = document.createElement("div");
        userIdDiv.classList.add("user-id");
        userIdDiv.innerText = user.id;

        const usernameDiv = document.createElement("div");
        usernameDiv.classList.add("user-username");
        usernameDiv.id = "username";
        usernameDiv.innerText = user.username;

        const statusDiv = document.createElement("div");
        statusDiv.classList.add("user-status");
        statusDiv.innerText = user.status;

        userCardDiv.appendChild(userPhotoDiv);
        userCardDiv.appendChild(userIdDiv);
        userCardDiv.appendChild(usernameDiv);
        userCardDiv.appendChild(statusDiv);

        userCardDiv.addEventListener("click", () => {
            renderUserAccount(user);
        });

        return userCardDiv;
    }

    function renderUserAccount(user) {
        const displayField = document.getElementById("displayField");
        displayField.innerHTML = ``;

        const userDiv = document.createElement("div");
        userDiv.classList.add("user-account-div");

        const userPhotoDiv = document.createElement("div");
        userPhotoDiv.classList.add("user-account-photo");

        const userPhotoImg = document.createElement("img");
        userPhotoImg.classList.add("user-account-avatar");
        userPhotoImg.src = "https://localhost:7219/User/avatar/" + user.id;

        userPhotoDiv.appendChild(userPhotoImg);

        const userInfoDiv = document.createElement("div");
        userInfoDiv.classList.add("user-account-info");

        const userIdDiv = document.createElement("div");
        userIdDiv.classList.add("user-account-id");
        userIdDiv.innerText = "ID: " + user.id;

        const usernameDiv = document.createElement("div");
        usernameDiv.classList.add("user-account-username");
        usernameDiv.id = "username";
        usernameDiv.innerText = "Username: " + user.username;

        const nameDiv = document.createElement("div");
        nameDiv.classList.add("user-account-name");
        nameDiv.id = "name";
        nameDiv.innerText = "Name: " + user.name;

        const emailDiv = document.createElement("div");
        emailDiv.classList.add("user-account-email");
        emailDiv.id = "email";
        emailDiv.innerText = "Email: " + user.email;

        const statusDiv = document.createElement("div");
        statusDiv.classList.add("user-account-status");
        statusDiv.id = "status";
        statusDiv.innerText = "Status: " + user.status;

        const dateJoinedDiv = document.createElement("div");
        dateJoinedDiv.classList.add("user-account-date-joined");
        dateJoinedDiv.id = "dateJoined";
        dateJoinedDiv.innerText = "Date joined: " + user.dateJoined;

        userInfoDiv.appendChild(userIdDiv);
        userInfoDiv.appendChild(usernameDiv);
        userInfoDiv.appendChild(nameDiv);
        userInfoDiv.appendChild(emailDiv);
        userInfoDiv.appendChild(statusDiv);
        userInfoDiv.appendChild(dateJoinedDiv);

        const userControllDiv = document.createElement("div");
        userControllDiv.classList.add("user-control");

        const editButton = document.createElement("div");
        editButton.classList.add("user-control-edit-user");
        editButton.textContent = "Редагувати користувача";
        editButton.addEventListener("click", enableEditing);

        const cancelButton = document.createElement("div");
        cancelButton.classList.add("user-control-cancel-edit");
        cancelButton.textContent = "Скасувати";
        cancelButton.style.display = "none";
        cancelButton.addEventListener("click", cancelEditing);

        const deleteButton = document.createElement("div");
        deleteButton.classList.add("user-control-delete-user");
        deleteButton.textContent = "Видалити користувача";
        deleteButton.addEventListener("click", () => {
            deleteUser(user.id);
        });

        userControllDiv.appendChild(editButton);
        userControllDiv.appendChild(cancelButton);
        userControllDiv.appendChild(deleteButton);

        userDiv.appendChild(userPhotoDiv);
        userDiv.appendChild(userInfoDiv);
        userDiv.appendChild(userControllDiv);

        displayField.appendChild(userDiv);

        let originalValues = {};

        function enableEditing() {
            const fields = ["username", "name"];
            originalValues = {};

            fields.forEach(field => {
                const div = document.getElementById(field);
                const value = div.innerText.split(": ")[1];
                originalValues[field] = value;
                div.innerHTML = `<input type="text" id="input-${field}" value="${value}">`;
            });

            editButton.textContent = "Зберегти користувача";
            editButton.removeEventListener("click", enableEditing);
            editButton.addEventListener("click", saveChanges);

            cancelButton.style.display = "inline-block";
        }

        function saveChanges() {
            const fields = ["username", "name"];
            fields.forEach(field => {
                const input = document.getElementById(`input-${field}`);
                const value = input.value;
                const div = document.getElementById(field);
                div.innerText = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${value}`;
            });

            editButton.textContent = "Редагувати користувача";
            editButton.removeEventListener("click", saveChanges);
            editButton.addEventListener("click", enableEditing);

            cancelButton.style.display = "none";
        }

        function cancelEditing() {
            const fields = ["username", "name"];
            fields.forEach(field => {
                const div = document.getElementById(field);
                div.innerText = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${originalValues[field]}`;
            });

            editButton.textContent = "Редагувати користувача";
            editButton.removeEventListener("click", saveChanges);
            editButton.addEventListener("click", enableEditing);

            cancelButton.style.display = "none";
        }

        const userProfileDiv = document.createElement("div");
        userProfileDiv.classList.add("user-songs");

        if (user.status == "artist") {
            renderUsersAlbums(user.id, userProfileDiv);
        }

        userDiv.appendChild(userProfileDiv);
    }

    async function getUserAlbums(userId) {
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

    async function renderUsersAlbums(userId, userProfile) {
        const albumsDiv = document.createElement("div");
        albumsDiv.classList.add("user-albums");

        const albums = await getUserAlbums(userId);

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

            // albumDiv.addEventListener("click", () => {
            //     const songClass = new Song();
            //     songClass.renderAlbumByAlbumId(album.id);
            // });

            albumsDiv.appendChild(albumDiv);
        });

        userProfile.appendChild(albumsDiv);
    }

    async function deleteUser(userId) {
        const response = await fetch(`https://localhost:7219/Admin/user?userId=${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            loadUsers();
        } else {
            console.error('Failed to delete user');
        }
    }

    async function editUser(user) {
        const response = await fetch(`https://localhost:7219/Admin/edituser?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            loadUsers();
        } else {
            console.error('Failed to edit user');
        }
    }

    async function loadRequests() {
        const displayField = document.getElementById('displayField');
        displayField.innerHTML = '<h2>Requests</h2>';

        const requestsDiv = document.createElement("div");
        requestsDiv.classList.add("requests-div");

        const requestsList = document.createElement("div");
        requestsList.classList.add("requests");

        try {
            const requests = await getRequests();

            requests.$values.forEach(request => {
                const userName = request.userUsername;
                const description = request.description;
                const confirmButton = document.createElement("button");
                confirmButton.id = "confirm";
                confirmButton.textContent = "Прийняти";

                const cancelButton = document.createElement("button");
                cancelButton.id = "cancel";
                cancelButton.textContent = "Відхилити";

                const requestHTML = `
                  <div>Користувач: ${userName}</div>
                  <div>Коментар: ${description}</div>
                `;

                const requestElement = document.createElement("div");
                requestElement.innerHTML = requestHTML;
                requestElement.appendChild(confirmButton);
                requestElement.appendChild(cancelButton);
                requestsList.appendChild(requestElement);

                confirmButton.addEventListener("click", () => {

                });

                cancelButton.addEventListener("click", () =>{
                    
                });
            });

            requestsDiv.appendChild(requestsList);
            displayField.appendChild(requestsDiv);
        } catch (error) {
            console.error('An error occurred while fetching requests:', error);
        }
    }

    async function getRequests() {
        try {
            const response = await fetch(`https://localhost:7219/Admin/requests`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('An error occurred while fetching data:', error);
        }
    }
});
