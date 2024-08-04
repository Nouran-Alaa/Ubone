// Navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled')
        navbar.classList.remove('static')
        
    } else {
        navbar.classList.remove('navbar-scrolled');
        navbar.classList.add('static')
    }
})