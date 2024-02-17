document.addEventListener("DOMContentLoaded", function(){
    const form = document.querySelector('form');

    console.log(form);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // try{
        //     const response = await fetch('https://localhost:7219/api/user', { method: 'GET'});
            
        //     if (response.ok) {
        //         alert('User added successfully');
        //     } else {
        //         alert('Failed to add user');
        //     }
        // }
        // catch(error){
        //     console.error('Error adding user:', error);
        //     alert('Error adding user'); 
        // }
        
        //const formData = new FormData(form);

        var userData = {
            id: 1,
            username: "john_doe",
            name: "John Doe",
            password: "securepassword",
            email: "john@example.com",
            date_joined: "2024-02-17", // Рядок, який представляє дату
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

        // const response = await fetch('https://localhost:7219/api/user', {
        // method: 'POST',
        // body: formData
        // });
        // if (response.ok) {
        // alert('User added successfully');
        // } else {
        //     alert('Failed to add user');
        // }
    });
});