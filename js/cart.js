document.addEventListener("DOMContentLoaded", () => {
  const discountCodes = {
    "ubone-10": 10,
    "ubone-20": 20,
  };

  // Function to render the cart items from session storage
  function renderCart() {
    const userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
    const cartTableBody = document.querySelector("tbody");
    cartTableBody.innerHTML = ""; // Clear any existing items

    userCart.forEach((item, index) => {
      const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
      const cartItemHtml = `
              <tr class="cart-item border-bottom" data-index="${index}">
                  <td class="item-media py-4 col-7">
                      <div class="cart-image d-flex">
                          <div>
                              <img src="${item.images[0]}" class="item-img" alt="${item.title}" loading="lazy" width="100" height="130">
                          </div>
                          <div class="item-info ps-4 w-100">
                              <div class="item-title">
                                  <h6>${item.title}</h6>
                              </div>
                              <div class="item-price pb-2">
                                  <span class="heading">${item.price}</span>
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

  let subtotalval = 0;

  // Function to update subtotal
  function updateSubtotal() {
    const userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
    const subtotal = userCart.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );
    document.querySelector(".total-num").textContent = `$${subtotal.toFixed(
      2
    )} USD`;

    subtotalval = subtotal;
  }

  const discountButton = document.querySelector(".apply");

  // Attach event listener to the discount apply button
  discountButton.addEventListener("click", applyDiscount);

  // Function to apply a discount code
  function applyDiscount() {
    const discountInput = document.querySelector(".discount-txt");
    const discountCode = discountInput.value.trim().toLowerCase();
    const discountPercent = discountCodes[discountCode] || 0;
    const subtotal = subtotalval;
    const discountAmount = (subtotal * discountPercent) / 100;

    const discountBody = document.querySelector("sub-total");

    let disCode = 0;
    if (discountPercent > 0) {
      disCode = `${discountAmount} USD`;
    } else {
      disCode = `Invalid discount code`;
    }

    const discountHtml = `<div class="s-total">
                                <span class="total-txt">Discount</span>
                                <span class="total-num">${disCode}</span>
                            </div>`;

    discountBody.appendChild(discountHtml);
  }

  // Function to update item quantity
  function updateItemQuantity(index, newQuantity) {
    const userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
    if (newQuantity < 1) newQuantity = 1; // Minimum quantity is 1
    userCart[index].quantity = newQuantity;
    sessionStorage.setItem("userCart", JSON.stringify(userCart));
    renderCart();
  }

  // Function to delete an item from the cart
  function deleteCartItem(index) {
    let userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
    userCart.splice(index, 1);
    sessionStorage.setItem("userCart", JSON.stringify(userCart));
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

  // Initial render of the cart
  renderCart();
});
