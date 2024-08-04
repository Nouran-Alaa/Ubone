document.addEventListener("DOMContentLoaded", function() {
    // Get the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetch(`https://dummyjson.com/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                // set main product image
                const mainImage = document.getElementById('main-image');
                mainImage.src = product.images[0];
                mainImage.alt = product.title;

                // set product thumbnails
                const productImages = document.getElementById('product-images');
                product.images.forEach((image, index) => {
                    if (index === 0) return; // Skip the main image
                    const imgElement = document.createElement('img');
                    imgElement.src = image;
                    imgElement.alt = product.title;
                    imgElement.classList.add('w-20', 'h-20', 'rounded-lg', 'mr-2', 'cursor-pointer');
                    imgElement.addEventListener('click', () => {
                        mainImage.src = image;
                    });
                    productImages.querySelector('.flex').appendChild(imgElement);
                });

                // set product details
                document.getElementById('product-title').innerText = product.title;
                document.getElementById('new-price').innerText = `$${product.price}`;
                document.getElementById('old-price').innerText = `$${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}`;
                document.getElementById('sale-timer').innerText = 'Sale ends in: 574:07:40:04';
                document.getElementById('product-availability').innerText = `Availability: ${product.availabilityStatus} (${product.stock} in stock)`;
                document.getElementById('product-description').innerText = product.description;
                document.getElementById('product-sku').innerText = product.sku;
                document.getElementById('product-brand').innerText = product.brand;
                document.getElementById('product-weight').innerText = product.weight;
                document.getElementById('product-dimensions').innerText = `${product.dimensions.width}x${product.dimensions.height}x${product.dimensions.depth}`;
                document.getElementById('product-warranty').innerText = product.warrantyInformation;
                document.getElementById('product-shipping').innerText = product.shippingInformation;

                // set product rating in stars
                const productRating = document.getElementById('product-rating');
                const fullStars = Math.floor(product.rating);
                const halfStar = product.rating % 1 !== 0;
                for (let i = 0; i < fullStars; i++) {
                    productRating.innerHTML += '<i class="fas fa-star"></i>';
                }
                if (halfStar) {
                    productRating.innerHTML += '<i class="fas fa-star-half-alt"></i>';
                }
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                for (let i = 0; i < emptyStars; i++) {
                    productRating.innerHTML += '<i class="far fa-star"></i>';
                }

                // set review count and reviews
                const reviewCount = product.reviews.length;
                document.getElementById('review-count').innerText = `${reviewCount} review${reviewCount !== 1 ? 's' : ''}`;

                // set product reviews
                const reviewsContainer = document.getElementById('product-reviews');
                product.reviews.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.classList.add('bg-gray-100', 'p-4', 'mt-4', 'rounded-lg');
                    reviewElement.innerHTML = `
                        <p><strong>${review.reviewerName}</strong> (${new Date(review.date).toLocaleDateString()}): ${review.comment} - ${review.rating} stars</p>
                    `;
                    reviewsContainer.appendChild(reviewElement);
                });
            })
            .catch(error => console.error('Error fetching product:', error));
    } else {
        console.error('No product ID found in URL');
    }
});

// redirect to cart page and pass the product ID
function redirectToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    window.location.href = `cart.html?id=${productId}`;
}

// redirect to buy page and pass the product ID
function redirectToBuy() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    window.location.href = `buy.html?id=${productId}`;
}
