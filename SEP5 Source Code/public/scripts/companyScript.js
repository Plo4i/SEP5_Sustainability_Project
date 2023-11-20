// Function for injecting the company data
function set_company(data) {

    // Injection of profile picture
    const image_url = data.details.image_url;
    document.getElementById('companyLogo').src = image_url;

    // Injection of name
    const name = data.details.name;
    document.getElementById('companyName').innerHTML = name;

    // Injection of description
    const description = data.details.description;
    document.getElementById('companyDescription').innerHTML = description;
};

// Function for setting title
function set_title(data) {
    document.title = data.title;
};


// Using the fetch function to execute back-end query for selected company details 
// and retrieve them for front-end use

fetch('/company/data' + window.location.search)  // Using fetch with http request + company CVR as a query
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok'); //Handling response if company not found
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        set_company(data); //Injecting data if company found
        set_title(data); 
    })
    .catch(error => {
        console.error('Error:', error);
    });


document.querySelector('.read-more').addEventListener('click', function () {
    var longText = document.querySelector('.long-text');
    var readMoreButton = document.querySelector('.read-more');
    var readLessButton = document.querySelector('.read-less');
    longText.style.display = 'inline';
    readMoreButton.style.display = 'none';
    readLessButton.style.display = 'inline';
});

document.querySelector('.read-less').addEventListener('click', function () {
    var longText = document.querySelector('.long-text');
    var readMoreButton = document.querySelector('.read-more');
    var readLessButton = document.querySelector('.read-less');
    longText.style.display = 'none';
    readMoreButton.style.display = 'inline';
    readLessButton.style.display = 'none';
});

