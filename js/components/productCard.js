import { addToCart } from "../api/cart.js";
import { updateCartCount } from "./header.js";

export function createProductCard(product) {

    const image = product.thumbnail || product.images?.[0]?.url || "./assets/images/products/default-product.jpg";

    const variant = product.variants?.[0];
    const price = variant?.calculated_price?.calculated_amount;

    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
        <div class="product-image-wrapper">
            <a href="product-details.html?product=${encodeURIComponent(product.handle)}" class="product-image-link">

                <img src="${image}" alt="${product.title}" class="product-image" loading="lazy">
            </a>
            <button class="wishlist-btn" type="button" aria-label="Add ${product.title} to wishlist" data-product-id="${product.id}">
                <i class="fa-regular fa-heart"></i>
            </button>
        </div>

        <div class="product-info">

            <h3 class="product-title">
                <a href="product-details.html?product=${encodeURIComponent(product.handle)}">
                    ${product.title}
                </a>
            </h3>

            <p class="product-description">
                ${product.description || "Discover more about this product."}
            </p>

            <div class="product-bottom">
                <div class="product-price">
                    ${price !== undefined ? `₹${price}` :"Price Unavailable"}
                </div>

                <button class="add-cart-btn" type="button" data-product-id= "${product.id}">
                    <i class="fa-solid fa-cart-shopping"></i> 
                    <span>Add to Cart</span>
                </button>
            <div>

        </div>
    `;

    const addToCartBtn = card.querySelector('.add-cart-btn');

    addToCartBtn.addEventListener("click", async () => {
        
        if(!variant) {
            alert("Product is unavailable");
            return;
        }
        try {
            addToCartBtn.disabled = true;
            addToCartBtn.textContent = "Adding ...";

            await addToCart(variant.id, 1);
            await updateCartCount();

            alert("Product added to cart");
        } catch(error) {
            console.error(
                "Error adding product to cart:",
                error
            );

            alert("Unable to add product to cart");
        } finally {
            addToCartBtn.disabled = false;
            addToCartBtn.textContent = "Add to Cart";
        }
    })

    return card;
}