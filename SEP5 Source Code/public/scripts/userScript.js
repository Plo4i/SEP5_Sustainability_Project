function set_profile(user) {
    const profile_box = document.getElementById('profile');

    profile_box.innerHTML += '<h1> Hello ' + user.username + '</h1><img src="' + user.image_url + '" alt="User Photo" title="User Photo"/>';

}

fetch('/user/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok'); //Handling response if company not found
        }
        return response.json();
    })
    .then(data => {

        set_profile(data.user); //Injecting user data 
    })
    .catch(error => {
        console.error('Error:', error);
    });


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