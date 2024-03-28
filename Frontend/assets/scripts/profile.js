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

            const profileUsername = document.getElementById('username');
            profileUsername.innerText = username;
        },
        error: function(error) {
            console.error("Error fetching user profile:", error.response);
        }
    });
});