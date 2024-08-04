function updateCartCounter() {
  const userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
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

function updateCartCounter() {
  const cartCounterElement = document.querySelector(".cart-counter");
  if (cartCounterElement) {
    cartCounterElement.textContent = userCart.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
  }
}

function addToWishlist(product) {
  let userWishlist = JSON.parse(sessionStorage.getItem("userWishlist")) || [];

  // Find if the product is already in the wishlist
  const existingProductIndex = userWishlist.findIndex(
    (item) => item.id === product.id
  );
  if (existingProductIndex === -1) {
    // Add the new product to the wishlist
    userWishlist.push(product);
  }

  // Update the sessionStorage
  sessionStorage.setItem("userWishlist", JSON.stringify(userWishlist));

  // Update the wishlist counter
  updateWishlistCounter();
}

function updateWishlistCounter() {
  const userWishlist = JSON.parse(sessionStorage.getItem("userWishlist")) || [];
  const wishlistCounterElement = document.querySelector(".wishlist-counter");
  if (wishlistCounterElement) {
    const wishlistCount = userWishlist.length;
    wishlistCounterElement.textContent = wishlistCount;
    console.log("Wishlist counter updated to: ${wishlistCount}");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  updateWishlistCounter();
});
