function showLoginForm() {
    document.getElementById('formTitle').innerHTML = 'Логін';
    document.getElementById('registrationForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function showRegistrationForm() {
    document.getElementById('formTitle').innerHTML = 'Реєстрація';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'block';
}

function register() {
    const form = document.getElementById('registrationForm');

    const user = {
        username: form.username.value,
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
    };

    $.ajax({
        type: "POST",
        url: "https://localhost:7219/User/user/register",
        contentType: "application/json",
        data: JSON.stringify(user),
        success: function(response) {
            console.log("Data sent successfully:", response);
            showLoginForm();
        },
        error: function(error) {
            console.error("Error while sending data:", error.response);
            alert('Error adding user');
        }
    });
}