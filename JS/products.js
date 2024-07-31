document.addEventListener("DOMContentLoaded", () => {
  // Function to update quantity
  function updateQuantity(event) {
    const quantityInput = event.target
      .closest(".quantity-controls")
      .querySelector(".quantity");
    let quantity = parseInt(quantityInput.value);

    if (event.target.classList.contains("plus")) {
      quantity += 1;
    } else if (event.target.classList.contains("minus")) {
      if (quantity > 1) {
        quantity -= 1;
      }
    }

    quantityInput.value = quantity;
  }

  // Function to handle adding items to the cart
  function addToCart(event) {
    const itemDiv = event.target.closest(".item");

    // Extract item details
    const title = itemDiv.querySelector(".item-title h6").innerText;
    const price = itemDiv.querySelector(".item-price .heading").innerText;
    const size = itemDiv
      .querySelector(".item-option span:nth-of-type(1)")
      .innerText.split(":")[1]
      .trim();
    const color = itemDiv
      .querySelector(".item-option span:nth-of-type(2)")
      .innerText.split(":")[1]
      .trim();
    const imageUrl = itemDiv.querySelector(".item-img").src; // Get the image URL
    const quantity = parseInt(itemDiv.querySelector(".quantity").value); // Get the quantity

    // Create item object
    const item = {
      title: title,
      price: price,
      size: size,
      color: color,
      imageUrl: imageUrl,
      quantity: quantity,
    };

    // Get the current cart from session storage
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Check if the item already exists in the cart
    const existingItem = cart.find(
      (cartItem) =>
        cartItem.title === item.title &&
        cartItem.size === item.size &&
        cartItem.color === item.color
    );

    if (existingItem) {
      // If the item exists, update the quantity
      existingItem.quantity += item.quantity;
    } else {
      // If the item does not exist, add it to the cart
      cart.push(item);
    }

    // Save the updated cart back to session storage
    sessionStorage.setItem("cart", JSON.stringify(cart));

    // For demonstration: log the updated cart
    console.log("Cart Updated:", cart);
  }

  // Attach event listeners to quantity buttons
  document.querySelectorAll(".plus, .minus").forEach((button) => {
    button.addEventListener("click", updateQuantity);
  });

  // Attach event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });
});
