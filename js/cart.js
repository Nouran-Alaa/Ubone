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
                                  <h6 class="fw-semibold">${item.title}</h6>
                              </div>
                              <div class="item-price pb-2">
                                  <span class="heading">$${item.price}</span>
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
    updateCartCounter();
  }

  let subtotalval = 0;

  // Function to update subtotal and progress bar
  function updateSubtotal() {
    const userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
    const subtotal = userCart.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );
    document.querySelector(".total-num").textContent = `$${subtotal.toFixed(
      2
    )} USD`;

    if (subtotal <= 100) {
      document.querySelector(".shipping-text").textContent = `SPEND $${(
        100 - subtotal
      ).toFixed(2)} MORE AND GET FREE SHIPPING!`;
    } else {
      document.querySelector(
        ".shipping-text"
      ).textContent = `Congratulations , you've got free shipping!`;
    }

    // increase progress bar size when subtotal increases
    const progressBar = document.querySelector(".progress-bar");
    const progressCircle = document.querySelector(".progress-circle");

    // Ensure the width does not exceed 100%
    const calculatedWidth = Math.min(subtotal, 100);
    progressBar.style.width = `${calculatedWidth}%`;

    // Move the circle to the edge of the progress bar
    progressCircle.style.left = `${calculatedWidth}%`;

    subtotalval = subtotal;
  }

  const discountButton = document.querySelector(".apply");

  // Attach event listener to the discount apply button
  discountButton.addEventListener("click", applyDiscount);

  // Function to apply a discount code
  function applyDiscount(e) {
    e.preventDefault();

    const discountInput = document.querySelector(".discount-txt");
    const discountCode = discountInput.value.trim().toLowerCase();
    const discountPercent = discountCodes[discountCode] || 0;
    const subtotal = subtotalval;
    const discountAmount = (subtotal * discountPercent) / 100;

    const discountVal = document.querySelector(".disc-num");

    discountVal.textContent = `Loading...`;

    setTimeout(() => {
      // Simulate loading time
      if (discountPercent > 0) {
        discountVal.textContent = `$${discountAmount.toFixed(2)} USD`;
      } else {
        discountVal.textContent = `invalid discount code`;
      }
    }, 500); // Simulate a delay
  }

  // Function to update item quantity
  function updateItemQuantity(index, newQuantity) {
    const userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
    if (newQuantity < 1) newQuantity = 1; // Minimum quantity is 1
    userCart[index].quantity = newQuantity;
    sessionStorage.setItem("userCart", JSON.stringify(userCart));
    renderCart();
  }

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
      updateCartCounter();
    }

    if (event.target.closest(".minus")) {
      const cartItem = event.target.closest(".cart-item");
      const index = cartItem.dataset.index;
      const currentQuantity = parseInt(cartItem.querySelector(".count").value);
      updateItemQuantity(index, currentQuantity - 1);
      updateCartCounter();
    }

    if (event.target.closest(".trash-icon")) {
      const cartItem = event.target.closest(".cart-item");
      const index = cartItem.dataset.index;
      deleteCartItem(index);
      updateCartCounter();
    }
  });

  // Shipping address calculation in the summary section

  const updateShippingCost = (e) => {
    e.preventDefault();
    const countryInput = document.getElementById("country");
    const shippingCountry = document.querySelector(".shipping-num");

    if (countryInput) {
      const address = countryInput.value.trim();
      if (address === "") {
        shippingCountry.innerText = "Enter shipping Country";
      } else {
        shippingCountry.innerText = "Loading...";
        setTimeout(() => {
          // Simulate loading time
          if (address === "Cairo" || address === "cairo") {
            shippingCountry.innerText = "$30.00 USD";
          } else if (address === "Giza" || address === "giza") {
            shippingCountry.innerText = "$20.00 USD";
          } else if (
            address === "Alexandria" ||
            address === "Alex" ||
            address === "alexa"
          ) {
            shippingCountry.innerText = "$50.00 USD";
          } else {
            shippingCountry.innerText = "Country not recognized";
          }
        }, 500); // Simulate a delay
      }
    }
  };

  // Add event listener to calculate shipping button
  const calcBtn = document.getElementById("calc-btn");
  calcBtn.addEventListener("click", updateShippingCost);

  // Initial render of the cart
  renderCart();
});
