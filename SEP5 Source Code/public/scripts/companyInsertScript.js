document.title = 'Insert company';

document.addEventListener('DOMContentLoaded', function () {
    const companyForm = document.getElementById('companyForm');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Check if the query parameter exists
    if (urlParams.has('processedData')) {
        // Retrieve and parse the processed data
        const processedData = JSON.parse(decodeURIComponent(urlParams.get('processedData')));

        document.getElementById('name').value = processedData.name;
        document.getElementById('cvr').value = processedData.cvr;
        document.getElementById('email').value = processedData.email;
        document.getElementById('ESG').value = processedData.esg_score;
        document.getElementById('website').value = processedData.website;
        document.getElementById('industry').value = processedData.industry;
        document.getElementById('description').value = processedData.description;
    } else {
        console.error('Processed data not found in the URL.');
    }

    companyForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(companyForm);

        fetch('/insertCompany', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())  // Assuming the server sends a JSON response
        .then(data => {
            window.location.href = '/user';
            alert('Company successfuly inserted!');
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
