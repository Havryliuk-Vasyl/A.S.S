document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    var userId = document.getElementById("userId").value;

    try {
        $.ajax({
            type: "GET",
            url: "https://localhost:7219/api/User/user/" + userId,
            contentType: "application/json",
            success: function(response) {
                console.log("Data recieved successfully:", response);
                displayUserInfo(response);
            },
            error: function(error) {
                console.error("Error while recieving data:", error);
            }
        });
    } catch (error) {
        console.error('Error getting user:', error);
        alert('Error getting user');
    }

});

function displayUserInfo(userData) {
    var userInfoHTML = "<h3>User Information</h3>" +
        "<p>ID: " + userData.id + "</p>" +
        "<p>Username: " + userData.username + "</p>" +
        "<p>Name: " + userData.name + "</p>" +
        "<p>Email: " + userData.email + "</p>" +
        "<p>Date Joined: " + userData.date_joined + "</p>" +
        "<p>Status: " + userData.status + "</p>";

    document.getElementById("userInfo").innerHTML = userInfoHTML;
}