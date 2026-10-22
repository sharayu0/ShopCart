import products from '../../data/products.json' with { type: 'json' }

const CART_KEY = "shopcartCart";
const CART_ID_KEY = "cartId";
const ORDERS_KEY = "shopcartOrders";

const shipping_options = [
    {
        id: "standard_shipping",
        name: "Standard Shipping",
        amount: 50
    },
    {
        id: "express_shipping",
        name: "Express Shipping",
        amount: 100
    }
]

function createId(prefix = "item") {
    const id = globalThis.crypto?.randomUUID?.()
        || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return `${prefix}_${id}`;
}

function readCart() {
    const rCart = localStorage.getItem(CART_KEY);
    return rCart ? JSON.parse(rCart) : null ;
}

function saveCart(cart) {

    calculateCartTotals(cart);

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    localStorage.setItem(CART_ID_KEY, cart.id);

    return cart;
}

function calculateCartTotals(cart) {
    cart.items = cart.items || [];

    cart.items.forEach(item => {
        item.subtotal = item.unit_price * item.quantity;
        item.total = item.subtotal;
    });

    cart.item_subtotal = cart.items.reduce(
        (total,item) => total + item.subtotal,
        0
    );

    cart.subtotal = cart.item_subtotal;

    cart.shipping_total = cart.shipping_methods.reduce(
        (total, method) => total + method.amount,
        0
    ) || 0;

    cart.total = cart.subtotal + cart.shipping_total;

    cart.total_quantity = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
    );
    return cart;
}

export async function createCart() {
    const cart = {
        id : createId("cart"),
        items : [],
        shipping_methods : [],
        item_subtotal : 0,
        subtotal : 0,
        shipping_total : 0,
        total : 0,
        total_quantity: 0
    };
    return saveCart(cart);
}

export async function getOrCreateCart() {
    const cart = readCart();
    if(cart) {
        localStorage.setItem(CART_ID_KEY, cart.id);
        return cart.id;
    }

    const newCart = await createCart();
    return newCart.id;
}

export async function addToCart(variantId, quantity=1) {
    if(!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Quantity must be atleast 1");
    }

    let cart = readCart();
    if(!cart) {
        cart = await createCart();
    }

    const product = products.find(product =>
        product.variants?.some(variant =>
            variant.id === variantId
        )
    );

    if(!product) {
        throw new Error("Product variant not found");
    }
    
    const variant = product.variants.find(variant =>
        variant.id === variantId
    );

    const existing_item = cart.items.find(item =>
        item.variant_id === variantId
    );

    if(existing_item) {
        existing_item.quantity += quantity; 
    } else {
        cart.items.push({
            id : createId("item"),
            variant_id : variant.id,
            product_id : product.id,
            title : product.title,
            product_title : product.title,
            thumbnail: product.thumbnail || "",
            description: product.description || "",
            handle: product.handle,
            variant_title: variant.title || "Default",
            options: variant.options || [],
            quantity,
            unit_price: Number(variant.price) || 0
        });
    }

    return saveCart(cart);
}

export async function getCart() {
    return readCart();
}

export async function updateCartItem(lineItemId, quantity) {
    const cart = readCart();
    if(!cart) {
        throw new Error("Cart not found");
    }
    const item = cart.items.find(item =>
        item.id === lineItemId
    );

    if(!item) {
        throw new Error("Cart item not found");
    }
    if(!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Quantity must be atleast 1");
    }

    item.quantity = quantity;
    return saveCart(cart);
}


export async function deleteCartItems(lineItemId) {
    const cart = readCart();

    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items = cart.items.filter(item=>
        item.id !== lineItemId
    );
    return saveCart(cart);
}

// Save checkout details on the local cart
export async function updateCart(cartId, cartData) {
    const cart = readCart();

    if (!cart || cart.id !== cartId) {
        throw new Error("Cart not found");
    }

    Object.assign(cart, cartData);

    return saveCart(cart);
}

// Return demo shipping options
export async function getShippingOptions(cartId) {
    const cart = readCart();

    if (!cart || cart.id !== cartId) {
        throw new Error("Cart not found");
    }

    return shipping_options;
}

// Save the selected demo shipping option
export async function addShippingMethods(cartId, optionId) {
    const cart = readCart();

    if (!cart || cart.id !== cartId) {
        throw new Error("Cart not found");
    }

    const option = shipping_options.find(
        option => option.id === optionId
    );

    if (!option) {
        throw new Error("Shipping option not found");
    }

    cart.shipping_methods = [{
        id: createId("shipping"),
        shipping_option_id: option.id,
        name: option.name,
        amount: option.amount,
        total: option.amount
    }];

    return saveCart(cart);
}

// Demo payment providers only
export async function getPaymentProviders() {
    return [
        {
            id: "pp_system_default",
            name: "Demo Payment"
        }
    ];
}

// Create a demo payment collection
export async function createPaymentCollection(cartId) {
    const cart = readCart();

    if (!cart || cart.id !== cartId) {
        throw new Error("Cart not found");
    }

    const paymentCollection = {
        id: createId("paycol"),
        cart_id: cartId,
        amount: cart.total,
        status: "pending"
    };

    localStorage.setItem(
        "shopcartPaymentCollection",
        JSON.stringify(paymentCollection)
    );

    return paymentCollection;
}

// Initialize a demo payment session
export async function initializePaymentSession(
    paymentCollectionId,
    providerId
) {
    const saved = localStorage.getItem("shopcartPaymentCollection");

    if (!saved) {
        throw new Error("Payment collection not found");
    }

    const paymentCollection = JSON.parse(saved);

    if (paymentCollection.id !== paymentCollectionId) {
        throw new Error("Payment collection not found");
    }

    paymentCollection.provider_id = providerId;
    paymentCollection.status = "pending";

    localStorage.setItem(
        "shopcartPaymentCollection",
        JSON.stringify(paymentCollection)
    );

    return paymentCollection;
}

// Place a demo order and clear the cart
export async function completeCart(cartId) {
    const cart = readCart();

    if (!cart || cart.id !== cartId) {
        throw new Error("Cart not found");
    }

    if (!cart.items.length) {
        throw new Error("Your cart is empty");
    }

    const order = {
        ...cart,
        id: createId("order"),
        display_id: Date.now(),
        created_at: new Date().toISOString(),
        status: "completed",
        payment_status: "demo",
        payment_provider: "demo",
        items: cart.items.map(item => ({ ...item }))
    };

    const savedOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
    );

    savedOrders.push(order);

    localStorage.setItem(ORDERS_KEY, JSON.stringify(savedOrders));

    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(CART_ID_KEY);
    localStorage.removeItem("shopcartPaymentCollection");

    return {
        type: "order",
        order
    };
}

// Retrieve a previously created demo order
export async function getOrder(orderId) {
    const orders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
    );

    const order = orders.find(order => order.id === orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
}
