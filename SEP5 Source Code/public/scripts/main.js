window.addEventListener('scroll', function () {
    const header = document.querySelector('.nav-container');
    header.classList.toggle("sticky", window.scrollY > 0);
});