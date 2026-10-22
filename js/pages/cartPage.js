import { getCart, updateCartItem, deleteCartItems } from "../api/cart.js";
import { updateCartCount } from "../components/header.js";

const cartContainer = document.querySelector(".cart-container");

async function loadCart() {
    try {
        const cart = await getCart();
        if(!cart) {
            showEmptyCart();
            return;
        }
       
        if(!cart.items || cart.items.length == 0) {
            showEmptyCart();
            return;
        }
        displayCart(cart);
        
    } catch(error) {
        console.error("Error loading cart", error);
        
        cartContainer.innerHTML = "<p> Unable to Load cart </p>"
    }
}
loadCart();

function showEmptyCart() {
    cartContainer.innerHTML = `
        <div class="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart.</p>
            <a href="index.html">
                Continue Shopping
            </a>
        </div>
    `;
}

function displayCart(cart) {
    let totalQuantity = 0;
    let subtotal = 0;
    let cartHtml = "";

    cart.items.forEach(item => {
        totalQuantity += item.quantity;

        const price = item.unit_price;

        const itemTotal = price * item.quantity;

        subtotal += itemTotal;

        cartHtml += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.thumbnail || ""}" alt="${item.product_title || item.title}">
                </div>

                <div class="cart-item-info">
                    <h2>${item.product_title || item.title}</h2>

                    <p class="cart-variant">
                        ${item.variant_title || ""}
                    </p>

                    <p class="cart-price">
                        ₹${price}
                    </p>

                    <div class="cart-quantity">
                        <button class="quantity-btn decrease-btn" 
                            data-item-id=${item.id}
                            ${item.quantity <=1 ? "disabled" : ""}
                        >
                            - 
                        </button>

                        <span class="quantity-value">
                            ${item.quantity}
                        </span>

                        <button 
                            class="quantity-btn increase-btn"
                            data-item-id=${item.id}
                        > 
                            + 
                        </button>

                        <button class="remove-item" data-item-id="${item.id}">
                            Remove
                        </button>

                    </div>
                    
                </div>

                 <div class="cart-item-total">
                    ₹${itemTotal}
                </div>

            </div>
        `;

    })

    cartContainer.innerHTML = `
        <div class="cart-items">
            ${cartHtml}
        </div>

        <div class="cart-summary">

            <h2>Cart Summary</h2>
            <p>
                Items: ${totalQuantity}
            </p>
            <p>
                Subtotal: ₹${subtotal}
            </p>
            <button 
                onclick = "window.location.href='checkout.html'" 
                id ="checkout-btn">
                    Proceed to Checkout
            </button>
        </div>
    `;

    addCartEventListeners();
}

function addCartEventListeners() {

    const increaseButtons = document.querySelectorAll(".increase-btn");
    const decreaseButtons = document.querySelectorAll(".decrease-btn");
    const removeButtons = document.querySelectorAll(".remove-item");

    increaseButtons.forEach(button => {
        button.addEventListener("click", async () => {

            const itemId = button.dataset.itemId;
            const currentQuantity = Number(
                button.closest('.cart-item-info')
                .querySelector('.quantity-value')
                .textContent
            );

            try {
                const cart = await updateCartItem(itemId, currentQuantity + 1);
                await updateCartCount();
                displayCart(cart); 
            }
            catch (error) {
                console.error(
                    "Error increasing quantity:",
                    error
                );

                alert("Unable to update quantity");
            }

        });
    });

    decreaseButtons.forEach(button => {

        button.addEventListener("click", async () => {

            const itemId = button.dataset.itemId;
            const currentQuantity = Number(
                button.closest('.cart-item-info')
                .querySelector('.quantity-value')
                .textContent
            );
            if(currentQuantity <= 1) {
                return;
            }
            try {
                const cart  = await updateCartItem(itemId, currentQuantity-1);
                await updateCartCount();
                displayCart(cart);
            } catch(error) {
                console.error("Error Decreasing quantity", error);
                alert("Unable to update quantity");
            }

        });
    });

    removeButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const itemId = button.dataset.itemId;

            try {
                await deleteCartItems(itemId);
                await updateCartCount();
                const cart = await getCart();

                if(!cart.items || cart.items.length == 0) {
                    showEmptyCart();
                    return;
                }
                displayCart(cart);
            } catch(error) {
                console.error(
                    "Error removing item:",
                    error
                );

                alert("Unable to remove item");
            }
        });
    });

}


