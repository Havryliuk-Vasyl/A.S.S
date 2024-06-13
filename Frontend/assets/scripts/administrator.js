document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('editingAccounts').addEventListener('click', loadUsers);
    document.getElementById('editingAlbums').addEventListener('click', loadAlbums);

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

    async function loadAlbums() {
        const displayField = document.getElementById('displayField');
        displayField.innerHTML = '<h2>Albums</h2>';
    }
});
