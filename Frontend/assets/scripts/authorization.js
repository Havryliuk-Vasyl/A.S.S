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