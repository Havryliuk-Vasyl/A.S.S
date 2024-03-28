document.addEventListener("DOMContentLoaded", function(){
    $.ajax({
        type: "GET",
        url: "https://localhost:7219/User/validateToken",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
            console.log("User profile:", response);

        },
        error: function(error) {
            console.error("Error fetching user profile:", error.response);
        }
    });
});

document.getElementById("back").addEventListener("click", function(){
    window.location.href = '../../index.html';
});

document.getElementById("exit").addEventListener("click", function(){
    localStorage.removeItem('token');

    window.location.href = '../pages/authorization.html';
});