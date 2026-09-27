const API_URL = "http://localhost:9000";
const REGION_ID = "reg_01M1DZN9X26QJSFJ8FJ44Y601V";
const headers = {
    "Content-Type": "application/JSON",
    "x-publishable-api-key": "pk_f37013d933742a5966e5fb4d34e41d77c4004fd61e7f445c38314fc6b72863a4"
};

export async function createCart() {
    const response = await fetch(
        `${API_URL}/store/carts`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                region_id: REGION_ID
            })
        }
    );

    if(!response.ok) {
        throw new Error("Unable to create Cart");
    }

    const data = await response.json();
    return data.cart;
}

export async function getOrCreateCart() {
    let cartId = localStorage.getItem("cartId");

    if(cartId) {
        return cartId;
    }

    const cart = await createCart();
    localStorage.setItem("cartId",cart.id);
    return cart.id;
}

export async function addToCart(variantId, quantity) {
    const cartId = await getOrCreateCart();

    const response = await fetch(
        `${API_URL}/store/carts/${cartId}/line-items`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                "variant_id": variantId,
                "quantity": quantity
            })
        }
    );
    console.log("Response status:", response.status);

    if(!response.ok) {
        const errorData = await response.json();

        console.log("Medusa error:", errorData);

        throw new Error("Unable to add product to Cart");
    }

    const data = await response.json();
    return data.cart;
}

export async function getCart() {
    const cartId = localStorage.getItem("cartId");

    if(!cartId) {
        return null;
    }

    const response = await fetch(
        `${API_URL}/store/carts/${cartId}`,
        {
            method: "GET",
            headers
        }
    );

    if(!response.ok) {
        throw new Error("Unable to fetch Cart");
    }

    const data = await response.json();
    
    return data.cart;
}

// Update quantity of items in cart
export async function updateCartItem(lineItemId, quantity) {
    const cartId = localStorage.getItem("cartId");

    if(!cartId) {
        throw new Error("Cart not found");
    }
    const response = await fetch(`
        ${API_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                quantity: quantity
            })
        }
    );

    if(!response.ok) {
        const errorData = await response.json();
        console.log("Medusa error:", errorData);
        throw new Error("Unable to update Cart item");
    }

    const data = await response.json();
    return data.cart;
}

// Remove item from cart
export async function deleteCartItems(lineItemId) {
    const cartId = localStorage.getItem("cartId");

    if(!cartId) {
        throw new Error("Cart not found");
    }

    const response = await fetch(
        `${API_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
        {
            method: "DELETE",
            headers
        }
    );

    if(!response.ok) {
        const errorData = await response.json();
        console.log("Medusa error:", errorData);

        throw new Error("Unable to remove cart item");
    }

    const data = await response.json();
    return data.cart; 
}

