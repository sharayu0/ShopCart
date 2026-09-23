export function createProductCard(product) {

    const image = product.thumbnail || product.images?.[0]?.url || "./assets/images/products/default-product.jpg";

    const variant = product.variants?.[0];
    const price = variant?.calculated_price?.calculated_amount;
    const currency = variant?.calculated_price?.currency_code || "inr";

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
                    ${price !== undefined 
                        ? `${currency.toUpperCase()} ₹${price.toLocaleString("en-IN")}`
                        :"Price Unavailable"
                    }
                </div>

                <button class="add-cart-btn" type="button" data-product-id= "${product.id}">
                    <i class="fa-solid fa-cart-shopping"></i> 
                    <span>Add to Cart</span>
                </button>
            <div>

        </div>
    `;
    return card;
}