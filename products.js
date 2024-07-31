// when document is loaded execute the code
document.addEventListener("DOMContentLoaded", function() {
    // fetch and display categories
    fetch('https://dummyjson.com/products/category-list')
        .then(response => response.json())
        .then(categories => {
            const categoriesContainer = document.getElementById('categories');
            // create buttons for each category to load its products
            categories.forEach(category => {
                const categoryElement = document.createElement('button');
                categoryElement.classList.add('text-left', 'bg-gray-200', 'p-2', 'rounded-lg', 'hover:bg-gray-300');
                categoryElement.innerText = category;
                categoryElement.addEventListener('click', () => loadCategoryProducts(category));
                categoriesContainer.appendChild(categoryElement);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));

    // fetch and display all products initially
    fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
            displayProducts(data.products);
        })
        .catch(error => console.error('Error fetching products:', error));
});

// load category products when category button is clicked
function loadCategoryProducts(category) {
    fetch(`https://dummyjson.com/products/category/${category}`)
        .then(response => response.json())
        .then(data => {
            // display products
            displayProducts(data.products);
            console.log(data.products);
        })
        .catch(error => console.error('Error fetching category products:', error));
}

// display products in a grid
function displayProducts(products) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md');
        productCard.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-48 object-cover rounded-lg">
            <h2 class="mt-4 text-lg font-bold">${product.title}</h2>
            <p class="text-gray-600">$${product.price}</p>
            <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg" onclick="redirectToDetail(${product.id})">View Details</button>
        `;
        productsContainer.appendChild(productCard);
    });
}

// redirect to product detail page with the product ID
function redirectToDetail(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}
