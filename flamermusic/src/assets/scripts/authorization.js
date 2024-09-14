function showLoginForm() {
    document.getElementById('formTitle').innerHTML = 'Логін';
    document.getElementById('registration').style.display = 'none';
    document.getElementById('login').style.display = 'block';
}

function showRegistrationForm() {
    document.getElementById('formTitle').innerHTML = 'Реєстрація';
    document.getElementById('login').style.display = 'none';
    document.getElementById('registration').style.display = 'block';
}

function registrate()
{
    const form = document.getElementById('registrationForm');

    const user = {
        username: form.username.value,
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
    };

    $.ajax({
        type: "POST",
        url: "https://localhost:7219/Authorization/register",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(user), 
        success: function(response) {
            console.log("Data sent successfully:", response);
            showLoginForm();
        },
        error: function(xhr) {
            if (xhr.status == 409 && xhr.responseText.includes("already exists")) {
                alert('User with this email already exists');
            } else {
                console.error("Error while sending data:", xhr.responseText);
            }
        }
    });
}

function login(){
    const form = document.getElementById('loginForm');

    const userLogin = {
        email: form.email.value,
        password: form.password.value,
    };

    $.ajax({
        type: "POST",
        url: "https://localhost:7219/Authorization/login",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(userLogin), 
        success: function(response) {
            console.log("Logged in successfully:", response);
            localStorage.setItem('token', response.data.token);
            window.location.href = '../../index.html';
        },
        error: function(error) {
            console.error("Error while logging in:", error.response);
            alert('Incorrect email or password');
        }
    });
}