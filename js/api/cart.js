const API_URL = "http://localhost:9000";
const REGION_ID = "reg_01M1DZN9X26QJSFJ8FJ44Y601V";
const headers = {
    "Content-Type": "application/json",
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
    const response = await fetch(
        `${API_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
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

export async function updateCart(cartId, cartData) {
    const response = await fetch(
        `${API_URL}/store/carts/${cartId}`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(cartData)
        }
    );
    if(!response.ok) {
        const errorData = await response.json();
        console.log("Medusa update cart error:", errorData);
        throw new Error("Unable to update cart");
    }

    const data = await response.json();
    return data.cart;
}

export async function getShippingOptions(cartId) {
    const response = await fetch(
        `${API_URL}/store/shipping-options?cart_id=${cartId}`,
        {
            method: "GET",
            headers
        }
    );
    if(!response.ok) {
        const errorData = await response.json();
        console.log("Medussa shipping option error", errorData);
        throw new Error("Unable to load shipping options");
    }
    const data = await response.json();
    return data.shipping_options;
}

export async function addShippingMethods(cartId, optionId) {
    const response = await fetch(
        `${API_URL}/store/carts/${cartId}/shipping-methods`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                option_id : optionId
            })
        }
    );
    if(!response.ok) {
        const errorData = await response.json();
        console.log("Medusa shipping method error:", errorData);
        throw new Error("Unable to add shipping method");
    }

    const data = await response.json();
    return data.cart;
}

export async function getPaymentProviders(regionId) {
    const response = await fetch(
        `${API_URL}/store/payment-providers?region_id=${regionId}`,
        {
            method: "GET",
            headers
        }
    );
    if(!response.ok) {
        const errorData = await response.json();
        console.log("Medusa payment provider error:", errorData);
        throw new Error("Unable to load payment providers");
    }

    const data = await response.json();
    return data.payment_providers;
}

export async function createPaymentCollection(cartId) {
    const response = await fetch(
        `${API_URL}/store/payment-collections`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                cart_id: cartId
            })
        }
    );
    if(!response.ok) {

        const errorData = await response.json();

        console.log("Medusa payment collection error:", errorData);
        throw new Error("Unable to create payment collection");
    }

    const data = await response.json();
    return data.payment_collection;
}

export async function initializePaymentSession(paymentCollectionId, providerId) {

    const response = await fetch(
        `${API_URL}/store/payment-collections/${paymentCollectionId}/payment-sessions`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                provider_id: providerId
            })
        }
    );
    if(!response.ok) {
        const errorData = await response.json();

        console.log("Medusa payment session error:", errorData);

        throw new Error("Unable to initialize payment");
    }

    const data = await response.json();
    return data.payment_collection;
}

export async function completeCart(cartId) {
    const response = await fetch(
        `${API_URL}/store/carts/${cartId}/complete`,
        {
            method: "POST",
            headers
        }
    );
    if(!response.ok) {
        const errorData = await response.json();
        console.log("Medusa complete cart error:", errorData);
        throw new Error("Unable to place order");
    }
    const data = await response.json();
    return data;
}

export async function getOrder(orderId) {
    const response = await fetch(
        `${API_URL}/store/orders/${orderId}`,
        {
            method: "GET",
            headers
        }
    );
    if(!response.ok) {
        const errorData = await response.json();
        console.log("Medusa get order error:", errorData);
        throw new Error("Unable to fetch order");
    }

    const data = await response.json();
    return data.order;
}