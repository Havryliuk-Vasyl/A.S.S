document.addEventListener("DOMContentLoaded", function(){
    const form = document.querySelector('form');

    console.log(form);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        var userData = {
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
    });
});

function recieveData(){
    fetch('https://localhost:7219/api/user')
    .then(response => response.json())
    .then(data => {
        console.log(data); 
        var userList = document.getElementById('user-list');
        data.forEach(user => {
          var listItem = document.createElement('li');
          listItem.textContent = user.name;
          userList.appendChild(listItem);
        });
     })
    .catch(error => {
        console.error('Помилка отримання даних:', error);
    });

}