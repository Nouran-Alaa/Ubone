document.addEventListener("DOMContentLoaded", () => {
  const discountCodes = {
    "ubone-10": 10,
    "ubone-20": 20,
  };

  // Function to render the cart items from session storage
  function renderCart() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const cartTableBody = document.querySelector("tbody");
    cartTableBody.innerHTML = ""; // Clear any existing items

    cart.forEach((item, index) => {
      const itemTotal = (
        parseFloat(item.price.replace("$", "")) * item.quantity
      ).toFixed(2);
      const cartItemHtml = `
              <tr class="cart-item border-bottom" data-index="${index}">
                  <td class="item-media py-4 col-7">
                      <div class="cart-image d-flex">
                          <div>
                              <img src="${item.imageUrl}" class="item-img" alt="${item.title}" loading="lazy" width="100" height="130">
                          </div>
                          <div class="item-info ps-4 w-100">
                              <div class="item-title">
                                  <h6>${item.title}</h6>
                              </div>
                              <div class="item-price pb-2">
                                  <span class="heading">${item.price}</span>
                              </div>
                              <div class="item-option d-flex flex-column">
                                  <span class="pb-2">
                                      <span class="heading">Size:</span>
                                      ${item.size}
                                  </span>
                                  <span>
                                      <span class="heading">Color:</span>
                                      ${item.color}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </td>
                  <td class="item-quantity py-4 col-3">
                      <div class="d-flex align-items-center gap-3">
                          <div class="qty">
                              <span class="minus"><i class='bx bx-minus'></i></span>
                              <input type="number" class="count" name="qty" value="${item.quantity}" readonly />
                              <span class="plus"><i class='bx bx-plus'></i></span>
                          </div>
                          <div class="trash-icon">
                              <a href="#" class="text-muted px-1">
                                  <i class='bx bx-trash trash-color'></i>
                              </a>
                          </div>
                      </div>
                  </td>
                  <td class="cart-item-totals py-4 col-2">
                      <div class="item-price">
                          <span class="heading">$${itemTotal}</span>
                      </div>
                  </td>
              </tr>`;
      cartTableBody.insertAdjacentHTML("beforeend", cartItemHtml);
    });
    updateSubtotal();
  }

  // Function to update subtotal
  function updateSubtotal() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const subtotal = cart.reduce(
      (acc, item) =>
        acc + parseFloat(item.price.replace("$", "")) * item.quantity,
      0
    );
    document.querySelector(".total-num").textContent = `$${subtotal.toFixed(
      2
    )} USD`;
  }

  // Function to update item quantity
  function updateItemQuantity(index, newQuantity) {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    if (newQuantity < 1) newQuantity = 1; // Minimum quantity is 1
    cart[index].quantity = newQuantity;
    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  // Function to delete an item from the cart
  function deleteCartItem(index) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  // Event listeners for plus, minus, and trash icons
  document.querySelector("tbody").addEventListener("click", (event) => {
    if (event.target.closest(".plus")) {
      const cartItem = event.target.closest(".cart-item");
      const index = cartItem.dataset.index;
      const currentQuantity = parseInt(cartItem.querySelector(".count").value);
      updateItemQuantity(index, currentQuantity + 1);
    }

    if (event.target.closest(".minus")) {
      const cartItem = event.target.closest(".cart-item");
      const index = cartItem.dataset.index;
      const currentQuantity = parseInt(cartItem.querySelector(".count").value);
      updateItemQuantity(index, currentQuantity - 1);
    }

    if (event.target.closest(".trash-icon")) {
      const cartItem = event.target.closest(".cart-item");
      const index = cartItem.dataset.index;
      deleteCartItem(index);
    }
  });

  // Function to apply a discount code
  function applyDiscount() {
    const discountInput = document.querySelector(".discount-txt");
    const discountCode = discountInput.value.trim().toLowerCase();
    const discountPercent = discountCodes[discountCode] || 0;
    const subtotal = calculateCartTotals();
    const discountAmount = (subtotal * discountPercent) / 100;
    const totalAfterDiscount = subtotal - discountAmount;

    document.querySelector(
      ".total-num"
    ).innerText = `$${totalAfterDiscount.toFixed(2)} USD`;

    if (discountPercent > 0) {
      alert(`Discount applied: ${discountPercent}% off`);
    } else {
      alert("Invalid discount code");
    }
  }

  // Attach event listener to the discount apply button
  document.querySelector(".apply").addEventListener("click", applyDiscount);

  // Initial render of the cart
  renderCart();
});
