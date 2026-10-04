import { getOrder } from "../api/cart.js";

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("order");

const orderLoading = document.querySelector("#order-loading");
const orderError = document.querySelector("#order-error");
const orderContent = document.querySelector("#order-content");
const orderIdElement = document.querySelector("#order-id");
const orderDetails = document.querySelector("#order-details");

async function loadOrder() {
    if(!orderId) {
        showError("Order Id is missing");
        return;
    }
    try {
        orderLoading.hidden = false;
        orderError.hidden = true;
        orderContent.hidden = true;

        const order = await getOrder(orderId);

        if(!order) {
            showError("Unable to find your order");
            return;
        }

        renderOrder(order);
        orderLoading.hidden = true;
        orderContent.hidden = false;
    } catch(error) {
        console.error("Error loading order:", error);
        showError("Unable to load order details.");
    }
}
loadOrder();

function renderOrder(order) {
    console.log(order)
    orderIdElement.textContent = order.id;

    let itemsHtml ="";

    order.items?.forEach(item => {
        const price = item.unit_price;
        const total = price * item.quantity;
        console.log(total)

        itemsHtml += `
            <div class="order-item">
                <img src="${item.thumbnail || ""}" alt="${item.product_title || item.title}">

                <div class="order-item-info">
                    <h3>
                        ${item.product_title || item.title}
                    </h3>
                    <p>
                        ${item.variant_title || ""}
                    </p>
                    <p>
                        Qty: ${item.quantity}
                    </p>
                </div>

                <div class="order-item-price">
                    ₹${total}
                </div>
            </div>
        `;
    });

    const subtotal = order.item_subtotal ?? 0;
    const shipping = order.shipping_total ?? 0;
    const total = order.total ?? subtotal;

    orderDetails.innerHTML = `
        <div class="order-items">
            <h2>Order Items</h2>
            ${itemsHtml}
        </div>
        <div class="order-summary">
            <h2>Order Summary</h2>

            <div class="summary-row">
                <span>Subtotal</span>
                <strong>₹${subtotal}</strong>
            </div>

            <div class="summary-row">
                <span>Shipping</span>
                <strong>₹${shipping}</strong>
            </div>

            <div class="summary-row summary-total">
                <span>Total</span>
                <strong>₹${total}</strong>
            </div>
        </div>
    `;
}

function showError(message) {
    orderLoading.hidden = true;
    orderContent.hidden = true;
    orderError.hidden = false;

    orderError.innerHTML = `
        <h2>Unable to Load Order</h2>
        <p>
            ${message}
        </p>
        <a href="index.html">
            Continue Shopping
        </a>
    `;
}