


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



async function getData() {
    try {
        const response = await fetch("https://dummyjson.com/products/category/womens-bags")
        const data = await response.json();
        showData(data.products)

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const productList = document.getElementById('products')

function showData(data) {
    for (let i = 1; i < data.length; i++) {
        const productElement = document.createElement('div')
        productElement.classList.add('product', 'col-md-3', 'col-sm-6')
        // To get details
        productElement.addEventListener("click", () => {
            const productId = data[i].id;  
            redirectToDetail(productId);
        });
        productElement.innerHTML = `
            <img src="${data[i].images[0]}" alt="${data[i].title}" class="product-img-main w-100" ">  
    <img src="${data[i].images[1] || e.images[0]}" alt="${data[i].title}" class="product-img-next w-100" ">  
    <div class="discount">
        <h3>${data[i].discountPercentage}%<h3>
    </div>
    <div class="overlay">
        <i class="icon fa fa-eye quick-view" aria-label="Quick View"></i>
    </div>
    <div class="products-info"> 
        <p>${data[i].title}</p>
        <div class="products-prices">
        <p>$${(data[i].price - (data[i].price * data[i].discountPercentage) / 100).toFixed(2)}</p>
        <p>$${data[i].price}</p>
        <div>
    </div>`
        productList.appendChild(productElement)
    }
}


getData();

// redirect to product detail page with the product ID
function redirectToDetail(productId) {
    window.location.href = `/html/product-detail.html?id=${productId}`;
}
