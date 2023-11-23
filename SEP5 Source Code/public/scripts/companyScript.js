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
function cancelRating() {
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

// Function to handle rating submission
function submitRating() {
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    const comments = document.getElementById('comments').value;

    if (!selectedRating) {
        alert('Please select a rating before submitting.');
        return;
    }

    // Get company_id from the URL parameter
    const company_id = getURLParameter('company_id');

    if (!company_id) {
        console.error('Company ID not found in the URL.');
        return;
    }

    // Get user_id from your authentication system (replace this with your logic)
    // const user_id = /* your user_id retrieval logic */;

    // if (!user_id) {
    //     console.error('User ID not found. Make sure the user is logged in.');
    //     return;
    // }

    const requestBody = {
        liked: selectedRating.value,
        comment: comments,
        company_id: company_id,
        // user_id: user_id
    };

    fetch('/save-rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Rating saved successfully:', data);
            // You may want to provide user feedback here
        })
        .catch(error => {
            console.error('Error:', error);
            // You may want to handle errors and provide user feedback
        });
}
