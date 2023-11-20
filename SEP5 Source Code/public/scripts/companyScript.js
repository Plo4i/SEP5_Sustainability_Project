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