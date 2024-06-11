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

        const ul = document.createElement('ul');
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.name} (${user.username}) - ${user.email}`;

            const deleteUserButton = document.createElement('button');
            deleteUserButton.textContent = 'Delete';
            deleteUserButton.addEventListener('click', () => deleteUser(user.id));

            const editUserButton = document.createElement('button');
            editUserButton.textContent = 'Edit';
            editUserButton.addEventListener('click', () => editUser(user.id));

            li.appendChild(deleteUserButton);
            li.appendChild(editUserButton);
            ul.appendChild(li);
        });

        displayField.appendChild(ul);
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

    async function editUser(userId) {
        const newUsername = prompt('Enter new username');
        const newName = prompt('Enter new name');
        const newEmail = prompt('Enter new email');

        const user = {
            username: newUsername,
            name: newName,
            email: newEmail
        };

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
        // Implement logic to load and display albums
        const displayField = document.getElementById('displayField');
        displayField.innerHTML = '<h2>Albums</h2>';
        // Add your logic to load albums from the server
    }
});
