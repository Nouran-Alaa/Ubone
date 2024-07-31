


// Slider & Animation
$(document).ready(function () {
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
    items: 1,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    animateOut: 'fadeOut'
});
$('#brands').owlCarousel({
    items: 5,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true
});

const productList = document.querySelector('.product-grid')











async function getData() {
    try {
        const response = await fetch("https://dummyjson.com/products/category/womens-bags")
        const data = await response.json();
        console.log(data.products);
    showData(data.products)

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function showData(data) {
    data.forEach(e => {
        const productElement = document.createElement('div')
        productElement.classList.add('product')
        productElement.innerHTML = `<div>
            <img src="${e.images[0]}" alt="${e.title}" class="product-img-main" loading="lazy">  
    <img src="${e.images[1] || product.images[0]}" alt="${e.title}" class="product-img-next" loading="lazy">  
    <div class="discount">
        <h3>${e.discountPercentage}%<h3>
    </div>
    <div class="overlay">
        <i class="icon fa fa-cart-plus add-to-cart" aria-label="Add to Cart"></i>
        <i class="icon fa fa-eye quick-view" aria-label="Quick View"></i>
        <i class="icon fa fa-heart add-to-wishlist" aria-label="Add to Wishlist"></i>
    </div>
    <div class="products-info"> 
        <p>${e.title}</p>
        <div class="products-prices">
        <p>$${(e.price - (e.price * e.discountPercentage) / 100).toFixed(2)}</p>
        <p>$${e.price}</p>
        <div>
    </div></div>`
        productList.appendChild(productElement)
    });




}
// }
getData();

