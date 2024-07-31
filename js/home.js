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


// Slider & Animation
$(document).ready(function(){
    $(".owl-carousel").owlCarousel();
    AOS.init({
        once: true 
    });

  
    setTimeout(function () {
        $(".collection-btn").addClass("aos-animate");
    }, 400); 
  });

  var owl = $('#slider1');
  owl.owlCarousel({
      items:1,
      loop:true,
      margin:10,
      autoplay:true,
      autoplayTimeout:2000,
      autoplayHoverPause:true,
      animateOut: 'fadeOut'
  });  
  $('#brands').owlCarousel({
      items:5,
      loop:true,
      margin:10,
      autoplay:true,
      autoplayTimeout:2000,
      autoplayHoverPause:true
  });
 