import {
    getCart,
    updateCart,
    getShippingOptions,
    addShippingMethods,
    getPaymentProviders,
    createPaymentCollection,
    initializePaymentSession,
    completeCart
} from '../api/cart.js';

const checkoutLoading = document.querySelector("#checkout-loading");
const checkoutError = document.querySelector("#checkout-error");
const checkoutContent = document.querySelector("#checkout-content");
const shippingOptionsContainer = document.querySelector("#shipping-options");
const paymentOptionsContainer = document.querySelector("#payment-options");
const placeOrderButton = document.querySelector("#place-order");
const checkoutSummary = document.querySelector("#checkout-summary");

let currentCart = null;
let selectedShippingOption = null;
let selectedPaymentProvider = null;

// Load checkout
async function loadCheckout() {
    try {
        checkoutLoading.hidden = false;
        checkoutError.hidden = true;
        checkoutContent.hidden = true;
        
        const cart = await getCart();
        
        if(!cart) {
            showError("Your cart is empty. Please add a product first.");
            return;
        }
        currentCart = cart;
console.log(cart)
        displaySummary(cart);
        await loadShippingOptions(cart);
        await loadPaymentProviders(cart);
        
        checkoutLoading.hidden = true;
        checkoutContent.hidden = false;

    } catch(error) {

        console.error("Checkout loading Error", error);
        showError("Unable to load checkout, Please try again")
    }
}

function displaySummary(cart) {
    let itemsHtml;

    cart.items.forEach(item => {
        
        const price = item.unit_price || 0;
        const total = price * item.quantity;

        itemsHtml += `
            <div class="summary-item">
                <img src="${item.thumbnail}" alt="${item.product_title || item.title}">

                <div class="summary-item-info">
                    <h3>${item.product_title || item.title}</h3>
                    <p>
                        ${item.variant_title || ""}
                    </p>
                    <p>
                        Qty: ${item.quantity}
                    </p>
                    <p>
                        ₹${total}
                    </p>
                </div>
            </div>
        `;
    });

    const subtotal = cart.item_subtotal ?? 0;
    const shipping = cart.shipping_total ?? 0;
    const total = cart.total ?? subtotal;

    checkoutSummary.innerHTML = `
        <h2>Order Summary</h2>
        ${itemsHtml}

        <div class="summary-row">
            <span>Subtotal</span>
            <strong>${subtotal}</strong>
        </div>

        <div class="summary-row">
            <span>Shipping</span>
            <strong>${shipping}</strong>
        </div>

        <div class="summary-row summary-total">
            <span>Total</span>
            <strong>${total}</strong>
        </div>

    `;
}

// Shipping Options
async function loadShippingOptions(cart) {

    shippingOptionsContainer.innerHTML = "Loading shipping options...";

    const shippingOptions = await getShippingOptions(cart.id);

    if(!shippingOptions || shippingOptions.length == 0) {
        shippingOptionsContainer.innerHTML = `
            <p>No shipping options are available.Please configure shipping in Medusa Admin.</p>
        `;
        return;
    }

    const filteredShippingOptions = shippingOptions.filter(option => {
        const priceObj = option.prices?.find(
            value => value.currency_code === cart.currency_code
        );
        return priceObj !== undefined;
    })
    shippingOptionsContainer.innerHTML = "";

    filteredShippingOptions.forEach((option, index) => {

        const price = option.amount;
        
        const wrapper = document.createElement("label");
        wrapper.className = "shipping-option";

        wrapper.innerHTML = `
            <input type="radio" name="shipping" value="${option.id}">

            <div>
                <strong>${option.name}</strong>
                <div>₹${price}</div>
            </div>
        `;
        shippingOptionsContainer.appendChild(wrapper);
    });
   
    const radioButtons = shippingOptionsContainer.querySelectorAll('input[name="shipping"]');

    radioButtons.forEach(radio => {

        radio.addEventListener("change", async () => {
           
            const option = filteredShippingOptions.find(
                item => item.id === radio.value
            );

            if(!option) {
                return;
            }

            try{
                placeOrderButton.disabled = true;
                currentCart = await addShippingMethods(currentCart.id, option.id);

                selectedShippingOption = option;

                displaySummary(currentCart);
            } catch(error) {
                console.error("Shipping method error:", error);
                alert("Unable to select shipping method.");
            } finally {
                placeOrderButton.disabled = false;
            }
        });
    });

}

// PAYMENT PROVIDERS
async function loadPaymentProviders(cart) {
    paymentOptionsContainer.innerHTML = "Loading payment methods...";
    
    const paymentProviders = await getPaymentProviders(cart.region_id);

    if(!paymentProviders || paymentProviders.length === 0) {

        paymentOptionsContainer.innerHTML = `
            <p>No payment method is configured.Please enable a payment provider in Medusa Admin.</p>
        `;
        return;
    }

    paymentOptionsContainer.innerHTML = "";

    paymentProviders.forEach((provider, index) => {

        const wrapper = document.createElement("label");
        wrapper.className = "payment-option";

        const title = getPaymentProvidersTitle(provider.id);

        wrapper.innerHTML = `
            <input type="radio" name="payment" value="${provider.id}">
            <span>${title}<span>
        `;
        paymentOptionsContainer.appendChild(wrapper);

    });

    

    const radioBtns = paymentOptionsContainer.querySelectorAll('input[name="payment"]');

    radioBtns.forEach(radio => {

        radio.addEventListener("change", () => {

            selectedPaymentProvider = paymentProviders.find(provider => {
                return provider.id === radio.value
            });

        });
    });

}

function getPaymentProvidersTitle(ProviderId) {
    if(ProviderId == "pp_system_default") {
        return "Manual Payment";
    }
    if(ProviderId.includes("manual")) {
        return "Manual Payment";
    }
    if(ProviderId.includes("stripe")) {
        return "stripe";
    }
    if(ProviderId.includes("razorpay")) {
        return "razorpay";
    }
    return ProviderId;
}

// Form validation
function validateForm() {
    const requiredFields = [
        'email',
        'first-name',
        'last-name',
        'address',
        'city',
        'state',
        'postal-code',
        'phone'
    ];

    for(const fieldId of requiredFields) {

        const field = document.querySelector(`#${fieldId}`);

        if(field.value.trim().length === 0) {

            field.focus();
            alert("Please fill all required fields");
            return false;
        }
    }
    return true;
}

placeOrderButton.addEventListener("click", async () => {

    if(!validateForm()) {
        return;
    }
    if(!currentCart) {
        alert("Cart not found");
        return;
    }
    if(!selectedShippingOption) {
        alert("Please select a shipping method.");
        return;
    }
    if(!selectedPaymentProvider) {
        alert("Please select a payment method");
        return;
    }

    try {
        placeOrderButton.disabled = true;

        // 1. UPDATE CUSTOMER + ADDRESS
        const cartData = {
            email: document.querySelector('#email').value.trim(),

            shipping_address : {
                first_name: document.querySelector('#first-name').value.trim(),
                last_name: document.querySelector('#last-name').value.trim(),
                address: document.querySelector('#address').value.trim(),
                city: document.querySelector('#city').value.trim(),
                state: document.querySelector('#state').value.trim(),
                postal_code: document.querySelector('#postal-code').value.trim(),
                country_code: document.querySelector('#country').value.trim(),
                phone: document.querySelector('#phone').value.trim()
            }
        }

        currentCart = await updateCart(currentCart.id, cartData);

        // 2. ADD SHIPPING METHOD
        
        // 3. CREATE PAYMENT COLLECTION
        const paymentCollection = await createPaymentCollection(currentCart.id);
        console.log("Payment Collection:", paymentCollection);
        
        // 4. INITIALIZE PAYMENT SESSION
        await initializePaymentSession(paymentCollection.id, selectedPaymentProvider.id);

        // Complete Cart
        const result = await completeCart(currentCart.id);

        console.log("complete cart result", result);

        // 6. ORDER CREATED
        if(result.type === "order" && result.order) {
            const order = result.order;

            localStorage.setItem("lastOrderId", order.id);
            localStorage.removeItem("cartId");
            window.location.href = `order-confirmation.html?order=${encodeURIComponent(order.id)}`;
        } else {
            throw new Error(result.error || "Unable to place order");
        }

    } catch(error) {
        console.error("Place order error:", error);
        alert(error.message || "Unable to place order.");
        placeOrderButton.disabled = false;
    }
});

function showError(message) {

    checkoutLoading.hidden = true;
    checkoutContent.hidden = true;
    checkoutError.hidden = false;
    checkoutError.textContent = message;
}

loadCheckout();
