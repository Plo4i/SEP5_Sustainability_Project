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

// Code to show/hide comments section based on radio button selection
const commentsSection = document.getElementById('commentsSection');

document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        // Show comments section if any radio button is selected
        commentsSection.style.display = 'block';
    });
});

// Function to handle canceling the rating
function cancelRating(event) {
    event.preventDefault(); // Prevent the default form submission

    const commentsSection = document.getElementById('commentsSection');
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    const commentsTextarea = document.getElementById('comments');

    // Reset selected rating and comments
    if (selectedRating) {
        selectedRating.checked = false;
    }
    commentsTextarea.value = '';

    // Hide the comments section
    commentsSection.style.display = 'none';
}

// Function to get URL parameters
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


// Function to handle rating submission
function submitRating(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get company_id from the URL parameter
    const company_id = getURLParameter('CVR');

    if (!company_id) {
        console.error('Company CVR not found in the URL.');
        return;
    }

    // Get user_id from wherever you are storing the logged-in user's information
    const user_id = getCookie('currentUserId');

    // Get liked and comment from the form
    const liked = document.querySelector('input[name="rating"]:checked').value;
    const comment = document.getElementById('comments').value;

    const formData = new FormData(document.getElementById('rating-form'));
    formData.append('company_id', company_id);
    formData.append('user_id', user_id);
    formData.append('liked', liked);
    formData.append('comment', comment);

    fetch('/company/save-rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Rating saved successfully:', data);

            // Hide the rating form
            document.getElementById('rating-form').style.display = 'none';

            // Show the thank you message
            document.querySelector('.thank-you-message').style.display = 'block';
        })
        .catch(error => {
            console.error('Fetch error:', error.message);
        });
}

// This code fetches the number of ratings and avarage score of the particular company

let companyId = getURLParameter('CVR');

fetch(`/company/rating?CVR=${companyId}`)
    .then(response => response.json())
    .then(data => {
        let score = Number(data.score);
        let scoreText = Number.isInteger(score) ? parseInt(score) : score.toFixed(1);
        document.querySelector('.rating p').textContent = `Reviews: ${data.reviews} • Score: ${scoreText}/5`;

        // Color the stars based on the avarage rating of the particular company
        // Get the star elements
        let stars = document.querySelectorAll('.rated1');

        // Remove all color classes from the stars
        stars.forEach(star => {
            star.classList.remove('red', 'orange', 'yellow', 'green', 'dark-green');
        });

        // Add the appropriate color class to the stars based on the score
        for (let i = 0; i < Math.floor(score); i++) {
            if (score < 2) {
                stars[i].classList.add('red');
            } else if (score < 3) {
                stars[i].classList.add('orange');
            } else if (score < 4) {
                stars[i].classList.add('yellow');
            } else if (score < 5) {
                stars[i].classList.add('green');
            } else {
                stars[i].classList.add('dark-green');
            }
        }

        // If the score has a decimal part, add the appropriate color class to the next star
        if (!Number.isInteger(score)) {
            let nextStar = stars[Math.floor(score)];
            if (score < 2) {
                nextStar.classList.add('red-gradient');
            } else if (score < 3) {
                nextStar.classList.add('orange-gradient');
            } else if (score < 4) {
                nextStar.classList.add('yellow-gradient');
            } else if (score < 5) {
                nextStar.classList.add('green-gradient');
            }
        }

    })
    .catch(error => console.error('Error:', error));

