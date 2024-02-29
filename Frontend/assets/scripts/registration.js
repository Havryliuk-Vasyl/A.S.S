document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById('userForm');

    console.log(form);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const user = {
            username: form.username.value,
            name: form.name.value,
            password: form.password.value,
            email: form.email.value,
            date_joined: form.date_joined.value,
            status: form.status.value
        };

        console.log(user);
        try {
            $.ajax({
                type: "POST",
                url: "https://localhost:7219/api/User",
                contentType: "application/json",
                data: JSON.stringify(user),
                success: function(response) {
                    console.log("Data sent successfully:", response);
                },
                error: function(error) {
                    console.error("Error while sending data:", error.response);
                }
            });
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Error adding user');
        }   
    });
});