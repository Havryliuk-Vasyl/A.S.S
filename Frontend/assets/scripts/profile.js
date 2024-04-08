document.addEventListener("DOMContentLoaded", function(){
    $.ajax({
        type: "GET",
        url: "https://localhost:7219/User/validateToken",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
            console.log("User profile:", response);

            const username = response.username;
            const email = response.email;
            const status = response.status;
            const userId = response.id;

            console.log(username, email, status);

            const profileUsername = document.getElementById('username');
            profileUsername.innerText = username;
            const profileEmail = document.getElementById('email');
            profileEmail.innerText = email;
            const profileStatus = document.getElementById('status');
            profileStatus.innerText = status;

            const avatarInput = document.getElementById('avatar-input');
            const uploadAvatarBtn = document.getElementById('upload-avatar-btn');
            const avatarImage = document.getElementById('avatar');
            avatarImage.src = "https://localhost:7219/User/avatar/" + userId; 

            uploadAvatarBtn.addEventListener('click', function() {
                const file = avatarInput.files[0];
                const formData = new FormData();
                formData.append('avatar', file);
                formData.append('userId', userId);

                $.ajax({
                    type: "POST",
                    url: "https://localhost:7219/User/uploadAvatar",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        console.log("Avatar uploaded successfully");
                    },
                    error: function(error) {
                        console.error("Error uploading avatar:", error);
                    }
                });

            });
        },
        error: function(error) {
            console.error("Error fetching user profile:", error.response);
        }
    });
});
