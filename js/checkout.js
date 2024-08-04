document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("scrollToTop") === "true") {
    sessionStorage.removeItem("scrollToTop");
    window.scrollTo(0, 0);
  }

  const discountCodes = {
    "ubone-10": 10,
    "ubone-20": 20,
  };

  const form = document.getElementById("myForm");
  const submitButton = document.querySelector(".btn-comp");

  const validateEmail = (email) => {
    const res = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return res.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const res = /^\d{11}$/;
    return res.test(phone);
  };

  const showError = (input, message) => {
    input.classList.add("error");
    let errorMessage = input.nextElementSibling.nextElementSibling;
    if (!errorMessage || !errorMessage.classList.contains("invalid-feedback")) {
      errorMessage = document.createElement("div");
      errorMessage.classList.add("invalid-feedback");
      input.parentNode.appendChild(errorMessage);
    }
    errorMessage.style.display = "block";
    errorMessage.innerText = message;
  };

  const removeError = (input) => {
    input.classList.remove("error");
    const errorMessage = input.nextElementSibling.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("invalid-feedback")) {
      errorMessage.style.display = "none";
    }
  };

  const showRadioError = (name, message) => {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach((radio) => {
      let errorMessage = radio.parentNode.querySelector(".invalid-feedback");
      if (!errorMessage) {
        errorMessage = document.createElement("div");
        errorMessage.classList.add("invalid-feedback");
        radio.parentNode.appendChild(errorMessage);
      }
      errorMessage.style.display = "block";
      errorMessage.innerText = message;
    });
  };

  const removeRadioError = (name) => {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach((radio) => {
      const errorMessage = radio.parentNode.querySelector(".invalid-feedback");
      if (errorMessage) {
        errorMessage.style.display = "none";
      }
    });
  };

  const validateField = (input) => {
    if (input.type === "email") {
      if (!validateEmail(input.value)) {
        showError(input, "Please enter a valid email address.");
      } else {
        removeError(input);
      }
    } else if (input.id === "phone") {
      if (!validatePhoneNumber(input.value)) {
        showError(input, "Please enter a valid phone number.");
      } else {
        removeError(input);
      }
    } else {
      if (input.value.trim() === "") {
        showError(input, "This field is required.");
      } else {
        removeError(input);
      }
    }
  };

  const validateRadioButtons = (name, errorMessage) => {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    let selected = false;
    radios.forEach((radio) => {
      if (radio.checked) {
        selected = true;
        removeRadioError(name);
      }
    });

    if (!selected) {
      showRadioError(name, errorMessage);
    }

    return selected;
  };

  const validateCreditCardSection = () => {
    const creditCardFields = ["card", "date", "security", "ncard"];
    let isCreditCardValid = true;

    creditCardFields.forEach(function (field) {
      const input = document.getElementById(field);
      if (input) {
        validateField(input);
        if (input.classList.contains("error")) {
          isCreditCardValid = false;
        }
      }
    });

    return isCreditCardValid;
  };

  const validateDifferentBillingAddressSection = () => {
    const billingFields = [
      "country2",
      "firstname2",
      "lastname2",
      "address2",
      "suite2",
      "city2",
      "state2",
      "zipCode2",
    ];
    let isBillingAddressValid = true;

    billingFields.forEach(function (field) {
      const input = document.getElementById(field);
      if (input) {
        validateField(input);
        if (input.classList.contains("error")) {
          isBillingAddressValid = false;
        }
      }
    });

    return isBillingAddressValid;
  };

  const clearCreditCardSectionErrors = () => {
    const creditCardFields = ["card", "date", "security", "ncard"];
    creditCardFields.forEach(function (field) {
      const input = document.getElementById(field);
      if (input) {
        removeError(input);
      }
    });
  };

  const clearDifferentBillingAddressSectionErrors = () => {
    const billingFields = [
      "country2",
      "firstname2",
      "lastname2",
      "address2",
      "suite2",
      "city2",
      "state2",
      "zipCode2",
    ];
    billingFields.forEach(function (field) {
      const input = document.getElementById(field);
      if (input) {
        removeError(input);
      }
    });
  };

  const radioMethods = document.querySelectorAll('input[name="method"]');
  radioMethods.forEach((radio) => {
    radio.addEventListener("change", function () {
      clearCreditCardSectionErrors();
    });
  });

  const radioAddresses = document.querySelectorAll('input[name="address"]');
  radioAddresses.forEach((radio) => {
    radio.addEventListener("change", function () {
      clearDifferentBillingAddressSectionErrors();
    });
  });

  form.addEventListener("input", function (event) {
    const input = event.target;
    if (
      input.tagName.toLowerCase() === "input" ||
      input.tagName.toLowerCase() === "checkbox"
    ) {
      validateField(input);
    }
  });

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    let isValid = true;

    const fields = [
      "email",
      "country",
      "firstname",
      "lastname",
      "address",
      "city",
      "state",
      "zipcode",
      "phone",
    ];

    fields.forEach(function (field) {
      const input = document.getElementById(field);
      if (input) {
        validateField(input);
        if (input.classList.contains("error")) {
          isValid = false;
        }
      }
    });

    // Validate radio buttons for payment method
    if (!validateRadioButtons("method", "Please select a payment method.")) {
      isValid = false;
    } else {
      const selectedMethod = document.querySelector(
        'input[name="method"]:checked'
      ).id;
      if (selectedMethod === "radio1") {
        if (!validateCreditCardSection()) {
          isValid = false;
        }
      }
    }

    // Validate radio buttons for billing address
    if (
      !validateRadioButtons(
        "address",
        "Please select a billing address option."
      )
    ) {
      isValid = false;
    } else {
      const selectedAddress = document.querySelector(
        'input[name="address"]:checked'
      ).id;
      if (selectedAddress === "radio5") {
        if (!validateDifferentBillingAddressSection()) {
          isValid = false;
        }
      }
    }

    if (isValid) {
      alert(
        "Thank you for your order! Your order has been successfully placed."
      );
      sessionStorage.setItem("scrollToTop", "true");
      location.reload(true);
    }
  });

  // Shipping address calculation in the summary section

  const deliveryAddressSpan = document.getElementById("delivery-address");
  const totalAmountSpan = document.getElementById("total-amount");

  const updateShippingCost = () => {
    const addressInput = document.getElementById("address");
    if (addressInput) {
      const address = addressInput.value.trim();
      if (address === "") {
        deliveryAddressSpan.innerText = "Enter shipping address";
        totalAmountSpan.innerText = "$98.00"; // Assuming subtotal is $98.00
      } else {
        deliveryAddressSpan.innerText = "Loading...";
        setTimeout(() => {
          // Simulate loading time
          if (address === "Cairo" || address === "cairo") {
            deliveryAddressSpan.innerText = "$30.00";
            totalAmountSpan.innerText = "$128.00"; // subtotal + Cairo shipping cost
          } else if (address === "Giza" || address === "giza") {
            deliveryAddressSpan.innerText = "$20.00";
            totalAmountSpan.innerText = "$118.00"; // subtotal + Giza shipping cost
          } else if (
            address === "Alexandria" ||
            address === "Alex" ||
            address === "alex"
          ) {
            deliveryAddressSpan.innerText = "$50.00";
            totalAmountSpan.innerText = "$148.00"; // subtotal + Alex shipping cost
          } else {
            deliveryAddressSpan.innerText = "Address not recognized";
            totalAmountSpan.innerText = "$98.00"; // Subtotal without additional cost
          }
        }, 500); // Simulate a delay
      }
    }
  };

  // Add event listener to address input
  const addressInput = document.getElementById("address");
  if (addressInput) {
    addressInput.addEventListener("input", updateShippingCost);
  }

  // Function to render the cart items from session storage
  function renderCart() {
    const userCart = JSON.parse(sessionStorage.getItem("userCart")) || [];
    const cartBodyItems = document.querySelector("#items-Summary");
    cartBodyItems.innerHTML = ""; // Clear any existing items

    userCart.forEach((item, index) => {
      const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);
      const cartItemHtml = `
              <div class="cart-item d-flex justify-content-between" data-index="${index}">
                        <div class="item-media py-2">
                          <div class="cart-image d-flex">
                            <div class="card mycard">
                              <div class="card-body p-0 div-img">
                                <img
                                  src="${item.images[0]}"
                                  class="p-1"
                                  alt="${item.title}"
                                  loading="lazy"
                                  width="60"
                                  height="72"
                                />
                              </div>

                              <div class="items-num">
                                <div class="circle">${item.quantity}</div>
                              </div>
                            </div>

                            <div
                              class="item-info ps-3 w-100 d-flex flex-column align-items-start justify-content-center"
                            >
                              <div class="item-title">
                                <h6>${item.title}</h6>
                              </div>
                              
                            </div>
                          </div>
                        </div>

                        <div class="cart-item-totals py-2">
                          <div class="item-price">
                            <span class="heading">$${itemTotal}</span>
                          </div>
                        </div>
                      </div>`;
      cartBodyItems.insertAdjacentHTML("beforeend", cartItemHtml);
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
    document.querySelector("#sub-total").textContent = `$${subtotal.toFixed(
      2
    )}`;

    document.querySelector("#total-amount").textContent = `$${subtotal.toFixed(
      2
    )}`;

    subtotalval = subtotal;
  }

  const discountButton = document.querySelector(".apply");

  // Attach event listener to the discount apply button
  discountButton.addEventListener("click", function () {
    const discountInput = document.querySelector(".discount-txt");
    const discountCode = discountInput.value.trim().toLowerCase();
    const discountPercent = discountCodes[discountCode] || 0;
    const subtotal = subtotalval;
    const discountAmount = (subtotal * discountPercent) / 100;
    const totalAfterDiscount = subtotal - discountAmount;

    const discountVal = document.querySelector("#total-dis");

    document.querySelector(
      "#total-amount"
    ).innerText = `$${totalAfterDiscount.toFixed(2)} USD`;

    if (discountPercent > 0) {
      discountVal.textContent = `$${discountAmount.toFixed(2)}`;
    } else {
      discountVal.textContent = `invalid discount code`;
    }
  });

  // Initial render of the cart
  renderCart();
});
