function set_company_cards(companies) {
    const companyContainer = document.getElementById('company-form');

    companies.forEach(function(company) {
        companyContainer.innerHTML += `<button class="company-button" value="${company.cvr}">
            <div class="logo-container">
            <img src="${company.image_url}" alt="Company Logo">
            </div>
            <div class="company-info">
            <span class="company-name">${company.name}</span>
            </div></button>`;
    });

// Add event listener for each button after they have been created
    document.querySelectorAll('.company-button').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            var buttonValue = this.value;
            document.getElementById('company-form').action = `/company?buttonValue= ${buttonValue}`;
            document.getElementById('company-form').submit();
        });
    });
}

// Function for setting title
function set_title(data) {
    document.title = data.title;
};

fetch('/companies')  // Using fetch with http request to get all companies
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok'); //Handling response if company not found
        }
        return response.json();
    })
    .then(data => {

        set_company_cards(data.companies); //Injecting data if company found
        set_title(data);
        
    })
    .catch(error => {
        console.error('Error:', error);
    });