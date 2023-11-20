document.title = 'Insert company';

document.addEventListener('DOMContentLoaded', function () {
    const companyForm = document.getElementById('companyForm');

    companyForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(companyForm);

        fetch('/insertCompany', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())  // Assuming the server sends a JSON response
        .then(data => {
            alert('Company successfuly inserted!')
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
