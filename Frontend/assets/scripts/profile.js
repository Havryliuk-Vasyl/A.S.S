document.addEventListener("DOMContentLoaded", function(){
    $.ajax({
        type: "GET",
        url: "https://localhost:7219/User/validateToken",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token') // Передача токену у заголовку Authorization
        },
        success: function(response) {
            console.log("User profile:", response);

            const username = response.username;
            const email = response.email;
            const status = response.status;

            console.log(username, email, status);

            const profileUsername = document.getElementById('username');
            profileUsername.innerText = username;
            const profileEmail = document.getElementById('email');
            profileEmail.innerText = email;
            const profileStatus = document.getElementById('status');
            profileStatus.innerText = status;
        },
        error: function(error) {
            console.error("Error fetching user profile:", error.response);
        }
    });
});