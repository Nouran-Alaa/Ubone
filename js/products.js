let products = [];
const productsPerPage = 18;
let currentPage = 1;

const urls = [
  "https://dummyjson.com/products/category/tops",
  "https://dummyjson.com/products/category/womens-dresses",
  "https://dummyjson.com/products/category/womens-bags",
  "https://dummyjson.com/products/category/womens-jewellery",
  "https://dummyjson.com/products/category/womens-shoes",
  "https://dummyjson.com/products/category/womens-watches",
  "https://dummyjson.com/products/category/sunglasses",
  "https://dummyjson.com/products/category/beauty",
  "https://dummyjson.com/products/category/mens-watches",
  "https://dummyjson.com/products/category/mens-shoes",
  "https://dummyjson.com/products/category/mens-shirts",
  "https://dummyjson.com/products/category/skin-care",
  "https://dummyjson.com/products/category/fragrances",
];

let userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
let userWishList = JSON.parse(sessionStorage.getItem("userWishList")) || [];

async function fetchProducts() {
  try {
    const fetchPromises = urls.map((url) =>
      fetch(url).then((response) => response.json())
    );
    const dataArrays = await Promise.all(fetchPromises);
    console.log("Fetched data arrays:", dataArrays);

    // Combine all data arrays into a single array
    const allProducts = dataArrays.flatMap((data) => data.products);
    console.log("Combined product list:", allProducts);

    // Process and display products
    products = allProducts;
    displayProducts(currentPage);
    setupPagination();
    setupFilters();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

fetchProducts();
// Function to redirect to product detail page
function redirectToDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

// Retrieve counter values from sessionStorage and set them on the elements
const wishlistCounterElement = document.querySelector(".wishlist-counter");
const cartCounterElement = document.querySelector(".cart-counter");

document.addEventListener("DOMContentLoaded", () => {
  const storedWishlistCounter = sessionStorage.getItem("wishlistCounter");
  const storedCartCounter = sessionStorage.getItem("cartCounter");

  if (storedWishlistCounter !== null) {
    wishlistCounterElement.textContent = storedWishlistCounter;
  }

  if (storedCartCounter !== null) {
    cartCounterElement.textContent = storedCartCounter;
  }
});

// Function to display products on the page
function displayProducts(page) {
  const productGrid = document.querySelector(".product-grid");
  productGrid.innerHTML = "";

  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const productsToShow = filterProducts(products).slice(start, end);

  productsToShow.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.setAttribute("data-id", product.id); // Store product.id in a data attribute
    productElement.innerHTML = `
      <img src="${product.images[0]}" alt="${
      product.title
    }" class="product-img-main" loading="lazy">  
      <img src="${product.images[1] || product.images[0]}" alt="${
      product.title
    }" class="product-img-next" loading="lazy">  
      <div class="discount">
        <h3>${product.discountPercentage}%<h3>
      </div>
      <div class="overlay">
        <i class="icon fa fa-cart-plus add-to-cart" aria-label="Add to Cart"></i>
        <i class="icon fa fa-eye quick-view" aria-label="Quick View"></i>
        <i class="icon fa fa-heart add-to-wishlist" aria-label="Add to Wishlist"></i>
      </div>
      <div class="products-info"> 
        <p>${product.title}</p>
        <div class="products-prices">
          <p>$${(
            product.price -
            (product.price * product.discountPercentage) / 100
          ).toFixed(2)}</p>
          <p>$${product.price}</p>
        </div>
      </div>
    `;

    // Add event listener to overlay to stop event propagation
    const overlayElement = productElement.querySelector(".overlay");
    overlayElement.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the event from bubbling up to productElement
    });

    // Add event listener for "Quick View" button
    const quickViewButton = productElement.querySelector(".quick-view");
    quickViewButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the event from bubbling up to productElement
      const productId = productElement.getAttribute("data-id");
      showQuickViewModal(productId); // Function to show the modal
    });

    // Add event listener for "Add to Cart" button
    const addToCartButton = productElement.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", function (event) {
      event.stopPropagation();
      const productId = productElement.getAttribute("data-id");
      let productAddToCart = products.find(
        (product) => product.id === parseInt(productId)
      );

      if (productAddToCart) {
        const existingItem = userCart.find(
          (item) => item.id === parseInt(productId)
        );

        if (existingItem) {
          // If the item exists in the cart, increment its quantity
          existingItem.quantity = (existingItem.quantity || 0) + 1;
        } else {
          // If the item doesn't exist in the cart, add it with a quantity of 1
          productAddToCart.quantity = 1;
          userCart.push(productAddToCart);
        }
      }

      console.log(userCart);
      // Update the cart counter and save to sessionStorage
      cartCounterElement.textContent = userCart.reduce(
        (acc, curr) => acc + curr.quantity,
        0
      );
      sessionStorage.setItem("cartCounter", cartCounterElement.textContent);
      sessionStorage.setItem("userCart", JSON.stringify(userCart));
    });

    // Add event listener for "Add to Wishlist" button
    const addToWishListBtn = productElement.querySelector(".add-to-wishlist");
    addToWishListBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      const productId = productElement.getAttribute("data-id");
      let productAddToWishlist = products.find(
        (product) => product.id === parseInt(productId)
      );

      if (productAddToWishlist) {
        const existingItem = userWishList.find(
          (item) => item.id === parseInt(productId)
        );

        if (existingItem) {
          // If the item exists in the wishlist, increment its quantity
          existingItem.wishlist = (existingItem.wishlist || 0) + 1;
        } else {
          // If the item doesn't exist in the wishlist, add it with a quantity of 1
          productAddToWishlist.wishlist = 1;
          userWishList.push(productAddToWishlist);
        }
      }
      console.log(userWishList);
      // Update the wishlist counter and save to sessionStorage
      wishlistCounterElement.textContent = userWishList.reduce(
        (acc, curr) => acc + curr.wishlist,
        0
      );
      sessionStorage.setItem(
        "wishlistCounter",
        wishlistCounterElement.textContent
      );
      sessionStorage.setItem("userWishList", JSON.stringify(userWishList));
    });

    // Add event listener for the product element to redirect to detail page
    productElement.addEventListener("click", () => {
      const productId = productElement.getAttribute("data-id");
      redirectToDetail(productId);
    });

    // Append the product element to the grid
    productGrid.appendChild(productElement);
  });
}

// Function to get product by ID
function getProductById(id) {
  return products.find((product) => product.id === parseInt(id));
}

// Function to show the quick view modal
function showQuickViewModal(productId) {
  const product = getProductById(productId);
  if (!product) {
    console.error("Product not found for ID:", productId);
    return;
  }
  console.log(product);

  const modalQuantityBtn = document.querySelector(".add-Cart-btn-m");
  const quantityValue = document.querySelector("#quantityInput");
  modalQuantityBtn.addEventListener("click", function (e) {
    e.preventDefault();

    function repeatProduct(item, quantity) {
      for (let i = 0; i < quantity; i++) {
        userCart.push(item);
      }
      return userCart;
    }
    console.log("clicked");
    repeatProduct(product, +quantityValue.value);
    console.log(userCart);
    cartCounterElement.textContent = userCart.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
  });

  // Populate the modal with product details
  let modalImages = document.querySelectorAll(".modalImage");

  modalImages.forEach((image, i) => {
    if (product.images[i]) {
      image.src = product.images[i];
      image.style.display = "block";
    } else {
      image.style.display = "none";
    }
  });
  document.getElementById("modalTitle").innerText = product.title;
  document.getElementById("modalPrice").innerText = `$${(
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2)}`;

  document.getElementById("modalDiscountPrice").innerText = `$${product.price}`;
  document.getElementById(
    "modalDiscount"
  ).innerText = `$${product.discountPercentage}%`;
  document.getElementById("modalRating").innerText = `${product.rating}`;

  document.getElementById(
    "modalDescription"
  ).innerText = `${product.description}`; // Placeholder text
  document.getElementById("modalAvailability").innerText = `Availability:  ${
    product.stock < 10
      ? `🟠 Low on Stock: ${product.stock} left`
      : `🟢 ${product.stock} In stock`
  }`; // Placeholder text

  // Display the modal
  const modal = document.getElementById("quickViewModal");
  modal.style.display = "block";
}

// Close the modal when the user clicks on <span> (x)
document.querySelector(".close").onclick = () => {
  document.getElementById("quickViewModal").style.display = "none";
};

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = (event) => {
  const modal = document.getElementById("quickViewModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
//////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const decreaseBtn = document.querySelector(".decrease");
  const increaseBtn = document.querySelector(".increase");
  const quantityInput = document.getElementById("quantityInput");

  decreaseBtn.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseBtn.addEventListener("click", () => {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
});
///////////////
function setupPagination() {
  const pagination = document.querySelector(".pagination");
  const totalPages = Math.ceil(
    filterProducts(products).length / productsPerPage
  );
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      currentPage = i;
      displayProducts(currentPage);
      setupPagination();
    });
    pagination.appendChild(button);
  }
}

function setupFilters() {
  const brandFilter = document.getElementById("brand-filter");
  const availabilityFilter = document.getElementById("availability-filter");
  const priceRangeInput = document.getElementById("price-range");
  const minPriceOutput = document.getElementById("min-price");
  const maxPriceOutput = document.getElementById("max-price");
  const categoryFilter = document.getElementById("category-filter");
  const resetFiltersButton = document.getElementById("resetFilters");
  // Extract brands, availability, price range, and categories from products
  const brands = new Set();
  const categories = {};
  let minPrice = Infinity;
  let maxPrice = 0;
  let inStock = 0;
  let outOfStock = 0;

  products.forEach((product) => {
    brands.add(product.brand);
    categories[product.category] = (categories[product.category] || 0) + 1;
    minPrice = Math.min(minPrice, product.price);
    maxPrice = Math.max(maxPrice, product.price);
    if (product.stock > 0) {
      inStock++;
    } else {
      outOfStock++;
    }
  });
  // Populate brand filter
  brands.forEach((brand) => {
    const label = document.createElement("label");
    if (brand) {
      label.innerHTML = `<input type="checkbox" value="${brand}"> ${brand}`;
      label.querySelector("input").addEventListener("change", () => {
        displayProducts(currentPage);
        setupPagination();
      });
      brandFilter.appendChild(label);
    }
  });

  // Populate availability filter
  const inStockLabel = document.createElement("label");
  inStockLabel.innerHTML = `<input type="checkbox" value="inStock"> In Stock (${inStock})`;
  inStockLabel.querySelector("input").addEventListener("change", () => {
    displayProducts(currentPage);
    setupPagination();
  });
  availabilityFilter.appendChild(inStockLabel);

  const outOfStockLabel = document.createElement("label");
  outOfStockLabel.innerHTML = `<input type="checkbox" value="outOfStock"> Out of Stock (${outOfStock})`;
  outOfStockLabel.querySelector("input").addEventListener("change", () => {
    displayProducts(currentPage);
    setupPagination();
  });
  availabilityFilter.appendChild(outOfStockLabel);

  // Set price range filter
  priceRangeInput.min = minPrice;
  priceRangeInput.max = maxPrice;
  priceRangeInput.value = maxPrice;

  minPriceOutput.textContent = minPrice;
  maxPriceOutput.textContent = maxPrice;

  priceRangeInput.addEventListener("input", function () {
    maxPriceOutput.textContent = this.value;
    displayProducts(currentPage);
    setupPagination();
  });

  // Populate category filter
  for (const [category, count] of Object.entries(categories)) {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${category}"> ${category} (${count})`;
    label.querySelector("input").addEventListener("change", () => {
      displayProducts(currentPage);
      setupPagination();
    });
    categoryFilter.appendChild(label);
  }

  resetFiltersButton.addEventListener("click", () => {
    // Clear all filter selections
    brandFilter
      .querySelectorAll("input")
      .forEach((input) => (input.checked = false));
    availabilityFilter
      .querySelectorAll("input")
      .forEach((input) => (input.checked = false));
    categoryFilter
      .querySelectorAll("input")
      .forEach((input) => (input.checked = false));

    // Reset price range
    priceRangeInput.value = priceRangeInput.max;
    maxPriceOutput.textContent = priceRangeInput.max;

    // Update the product display
    displayProducts(currentPage);
    setupPagination();
  });
}

function filterProducts(products) {
  const selectedBrands = Array.from(
    document.querySelectorAll("#brand-filter input:checked")
  ).map((input) => input.value);

  const selectedAvailability = Array.from(
    document.querySelectorAll("#availability-filter input:checked")
  ).map((input) => input.value);
  const selectedCategories = Array.from(
    document.querySelectorAll("#category-filter input:checked")
  ).map((input) => input.value);
  const maxPrice = document.getElementById("price-range").value;

  return products.filter((product) => {
    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const availabilityMatch =
      selectedAvailability.length === 0 ||
      (selectedAvailability.includes("inStock") && product.stock > 0) ||
      (selectedAvailability.includes("outOfStock") && product.stock === 0);
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    const priceMatch = product.price <= maxPrice;

    return brandMatch && availabilityMatch && categoryMatch && priceMatch;
  });
}

//Burger Menu toggle
function toggleMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const burger = document.getElementById("burger");
  if (mobileMenu.classList.contains("active")) {
    mobileMenu.classList.remove("active");
    burger.classList.remove("hidden");
  } else {
    mobileMenu.classList.add("active");
    burger.classList.add("hidden");
  }
}

function toggleSidebar() {
  const sidebar = document.querySelector(".filter-sidebar");
  sidebar.classList.toggle("visible");
}

function init() {
  displayProducts(currentPage);
  setupPagination();

  const toggleSidebarButton = document.querySelector(".toggle-sidebar-btn");
  toggleSidebarButton.addEventListener("click", toggleSidebar);
}

document.addEventListener("DOMContentLoaded", init);

document.addEventListener("DOMContentLoaded", function () {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  // Show the button when the user scrolls down 40% of the page height
  window.addEventListener("scroll", function () {
    if (window.scrollY > document.documentElement.scrollHeight * 0.4) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });

  // Smooth scroll to top when the button is clicked
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// Carousel functionality
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const carouselContent = document.querySelector(".carousel-content");
let currentIndex = 0;

leftArrow.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

rightArrow.addEventListener("click", () => {
  if (currentIndex < carouselContent.children.length - 1) {
    currentIndex++;
    updateCarousel();
  }
});

function updateCarousel() {
  const screenWidth = window.innerWidth;
  const itemWidth = carouselContent.children[0].offsetWidth;

  if (screenWidth > 1100) {
    // Reset the carousel position for desktop view
    carouselContent.style.transform = "translateX(0)";
    currentIndex = 0;
  } else {
    // Adjust the carousel position for smaller screens
    const newTransformValue = -currentIndex * (itemWidth + 20); // 20 is the margin between items
    carouselContent.style.transform = `translateX(${newTransformValue}px)`;
  }
}

// Initial update on page load
updateCarousel();

// Update carousel on window resize
window.addEventListener("resize", () => {
  updateCarousel();
});

// Toggle sidebar visibility
function toggleSidebar() {
  const sidebar = document.querySelector(".filter-sidebar");
  sidebar.classList.toggle("visible");
}

// Initialize toggle button functionality
function init() {
  displayProducts(currentPage);
  setupPagination();

  const toggleSidebarButton = document.querySelector(".toggle-sidebar-btn");
  toggleSidebarButton.addEventListener("click", toggleSidebar);
}

document.addEventListener("DOMContentLoaded", init);

// Function to toggle sidebar visibility
const toggleSidebarButton = document.querySelector(".toggle-sidebar-btn");
function toggleSidebar() {
  const sidebar = document.querySelector(".filter-sidebar");
  sidebar.classList.toggle("visible");
  toggleSidebarButton.style.visibility = "hidden";
}

// Function to close the sidebar
function closeSidebar() {
  const sidebar = document.querySelector(".filter-sidebar");
  sidebar.classList.remove("visible");
  toggleSidebarButton.style.visibility = "visible";
}

// Initialize the toggle and close button functionalities
function init() {
  displayProducts(currentPage);
  setupPagination();

  const toggleSidebarButton = document.querySelector(".toggle-sidebar-btn");
  const closeSidebarButton = document.querySelector(".close-sidebar-btn");

  toggleSidebarButton.addEventListener("click", toggleSidebar);
  closeSidebarButton.addEventListener("click", closeSidebar);
}

document.addEventListener("DOMContentLoaded", init);
