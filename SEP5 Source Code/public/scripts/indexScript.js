$(document).ready(function() {

    
    $('.companies-card').click(function() {
        const companyName = $(this).find('h3').text();

        $.ajax({
        url: '/company/:name',
        type: 'POST',
        data: { companyName: companyName },
        success: function(response) {
            console.log(response);
        }
        });
    });
    });