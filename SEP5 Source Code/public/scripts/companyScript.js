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

    
    const user_id = getCookie('currentUserId');

    // Check if the user is logged in
    if (!user_id) {
        // If the user is not logged in, redirect them to the login page
        window.location.href = '/login';
        return;
    }

    // Get company_id from the URL parameter
    const company_id = getURLParameter('CVR');

    if (!company_id) {
        console.error('Company CVR not found in the URL.');
        return;
    }

    // Get liked and comment from the form
    const liked = document.querySelector('input[name="rating"]:checked').value;
    const comment = document.getElementById('comments').value;

    const formData = new FormData(document.getElementById('rating-form'));
    formData.append('company_id', company_id);
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

            const selectedRating = document.querySelector('input[name="rating"]:checked');
            const commentsTextarea = document.getElementById('comments');

            // Reset selected rating and comments
            if (selectedRating) {
                selectedRating.checked = false;
            }
            commentsTextarea.value = '';
        })
        .catch(error => {
            console.error('Fetch error:', error.message);
        });
}

// This code fetches the number of ratings and avarage score of the particular company

let companyId = getURLParameter('CVR');

fetch(`/company/avarage-rating?CVR=${companyId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let score = Number(data.score);
        let scoreText = Number.isInteger(score) ? parseInt(score) : score.toFixed(1);
        document.querySelector('.avg-rating p').textContent = `Reviews: ${data.reviews} • Score: ${scoreText}/5`;

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

// Function to get the time when a review was written

function timeAgo(date) {
    const now = new Date();
    const secondsAgo = Math.round((now - date) / 1000);
    const minutesAgo = Math.round(secondsAgo / 60);
    const hoursAgo = Math.round(minutesAgo / 60);
    const daysAgo = Math.round(hoursAgo / 24);

    if (secondsAgo < 60) {
        return `${secondsAgo} seconds ago`;
    } else if (minutesAgo < 60) {
        return `${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
        return `${hoursAgo} hours ago`;
    } else {
        return `${daysAgo} days ago`;
    }
}

// Function to fetch and display the 3 most recent reviews
function fetchAndDisplayReviews(companyId) {
    fetch(`/company/reviews-sidebar?CVR=${companyId}&limit=3`)
        .then(response => response.json())
        .then(reviews => {
            const sidebarComments = document.querySelector('.sidebar-comments');
            sidebarComments.innerHTML = ''; // Clear the existing comments

            if (reviews.length === 0) {
                // If there are no reviews, display a message
                sidebarComments.innerHTML = '<div class="no-reviews-yet"><p>No reviews yet, be the first to write one!</p></div>';
            } else {
                reviews.forEach(review => {
                    // Skip if the comment is empty
                    if (!review.comment.trim()) {
                        return;
                    }

                    console.log(review);
                    console.log(review.image_url)
                    // Create the HTML for the review
                    const reviewHTML = `
                        <div class="comment">
                            <div class="user-information-wrap">
                                <div class="user-image">
                                    <img src="${review.userimage}" alt=" ${review.userImage} user logo">
                                </div>
                                <div class="user-name">
                                    <a href="#"><h3>${review.username}</h3></a>
                                </div>
                            </div>
                            <div class="comment-content-wrap">
                                <div class="comment-rating-date-wrap">
                                    <div class="comment-rating">
                                         ${Array(review.liked).fill().map(() => `<span class="iconify rated2 user-rating-star" data-icon="material-symbols:star"></span>`).join('')}
                                         ${Array(5 - review.liked).fill().map(() => `<span class="iconify rated2 user-rating-star" data-icon="material-symbols:star"></span>`).join('')}
                                    </div>
                                    <div class="date">
                                        <p>${timeAgo(new Date(review.date_created))}</p>
                                    </div>
                                </div>
                                <div class="comment-heading">
                                    <h3>${review.comment.split(' ').length > 10 ? review.comment.split(' ').slice(0, 10).join(' ') + '...' : review.comment}</h3>
                                </div>
                                <div class="comment-text">
                                    <p class="long-text">${review.comment}</p>
                                </div>
                            </div>
                            ${review.comment.split(' ').length > 10 ? '<button class="read-more">Read More <i class="arrow down"></i></button><button class="read-less" style="display: none;">Read Less <i class="arrow up"></i></button>' : ''}
                        </div>
                    `;

                    // Add the review to the sidebar comments
                    sidebarComments.innerHTML += reviewHTML;

                    // Get the last added review and its stars
                    const lastReview = sidebarComments.lastElementChild;
                    const stars = lastReview.querySelectorAll('.user-rating-star');

                    // Remove all color classes from the stars
                    stars.forEach(star => {
                        star.classList.remove('red', 'orange', 'yellow', 'green', 'dark-green');
                    });

                    // Add the appropriate color class to the stars based on the user's rating
                    for (let i = 0; i < review.liked; i++) {
                        if (review.liked < 2) {
                            stars[i].classList.add('red');
                        } else if (review.liked < 3) {
                            stars[i].classList.add('orange');
                        } else if (review.liked < 4) {
                            stars[i].classList.add('yellow');
                        } else if (review.liked < 5) {
                            stars[i].classList.add('green');
                        } else {
                            stars[i].classList.add('dark-green');
                        }
                    }
                });

                // Create the "read-more-reviews" element
                const readMoreReviews = document.createElement('p');
                readMoreReviews.className = 'read-more-reviews';
                readMoreReviews.innerHTML = '(<a href="#">Read More Reviews Here</a>)';

                // Add the "read-more-reviews" element after all reviews have been added
                sidebarComments.appendChild(readMoreReviews);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Fetch and display the reviews when the page loads
fetchAndDisplayReviews(companyId);

document.querySelector('.sidebar-comments').addEventListener('click', function (event) {
    if (event.target.matches('.read-more')) {
        var longText = event.target.closest('.comment').querySelector('.long-text');
        var readMoreButton = event.target;
        var readLessButton = event.target.closest('.comment').querySelector('.read-less');
        longText.style.display = 'inline';
        readMoreButton.style.display = 'none';
        readLessButton.style.display = 'inline';
    } else if (event.target.matches('.read-less')) {
        var longText = event.target.closest('.comment').querySelector('.long-text');
        var readMoreButton = event.target.closest('.comment').querySelector('.read-more');
        var readLessButton = event.target;
        longText.style.display = 'none';
        readMoreButton.style.display = 'inline';
        readLessButton.style.display = 'none';
    }
});