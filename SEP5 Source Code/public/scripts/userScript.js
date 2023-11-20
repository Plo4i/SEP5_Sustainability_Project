function logout() {
    var form = document.getElementById('userForm');
    form.action = 'user/logout';
    form.submit(); // You can submit the form immediately or trigger submission later
}

function home() {
    var form = document.getElementById('userForm');
    form.action = '/';
    form.submit(); // You can submit the form immediately or trigger submission later
}