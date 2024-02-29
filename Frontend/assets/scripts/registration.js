document.addEventListener("DOMContentLoaded", function(){
    const form = document.querySelector('form');

    console.log(form);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        var userData = {
            id: 0,
            username: "john_doe",
            name: "John Doe",
            password: "securepassword",
            email: "john@example.com",
            date_joined: "2024-02-17",
            status: "artist"
        };

        try {
            $.ajax({
                type: "POST",
                url: "https://localhost:7219/api/user",
                contentType: "application/json",
                data: JSON.stringify(userData),
                success: function(response) {
                    console.log("Data sent successfully:", response);
                },
                error: function(error) {
                    console.error("Error while sending data:", error);
                }
            });
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Error adding user');
        }   
    });
});