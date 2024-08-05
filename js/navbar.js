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

const userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
const cartCounterElement = document.querySelector(".cart-counter");

function updateCartCounter() {
  const cartCounterElement = document.querySelector(".cart-counter");
  if (cartCounterElement) {
    cartCounterElement.textContent = userCart.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
  }
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  updateCartCounter();
});

function updateWishlistCounter() {
  let userWishList = JSON.parse(sessionStorage.getItem("userWishList")) || [];
  const wishlistCounterElement = document.querySelector(".wishlist-counter");
  if (wishlistCounterElement) {
    wishlistCounterElement.textContent = userWishList.reduce(
      (acc, curr) => acc + curr.wishlist,
      0
    );
  }
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  updateWishlistCounter();
});
