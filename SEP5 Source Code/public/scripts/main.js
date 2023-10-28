// Add a scroll event listener to the window
window.addEventListener('scroll', function () {
    // Select the element with the class 'nav-container' and store it in the 'header' variable
    const header = document.querySelector('.nav-container');

    // Toggle the 'sticky' class on the 'header' element based on the scroll position
    header.classList.toggle("sticky", window.scrollY > 0);
});
