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

const form = document.getElementById('userForm');

function pageChange(value) {
    if(value === 'home') {
        form.action = '/';
    }
    else if(value === 'logout') {
        form.action = '/user/logout';
    }
    else if(value === 'insertCompany') {
        form.action = '/insertCompany';
    }
    
    form.submit(); // You can submit the form immediately or trigger submission later
}

