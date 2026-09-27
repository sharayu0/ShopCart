import { getProductsByHandle } from '../api/products.js';
import { addToCart } from '../api/cart.js';
import { updateCartCount } from '../components/header.js';

const urlParams = new URLSearchParams(window.location.search);
const productHandle = urlParams.get("product");

const productLoading = document.querySelector("#product-loading");
const productError = document.querySelector("#product-error");
const productDetails = document.querySelector("#product-details");
const productImage = document.querySelector("#product-image");
const productTitle = document.querySelector("#product-title");
const productPrice = document.querySelector("#product-price");
const productDescription = document.querySelector("#product-description");
const productVariants = document.querySelector("#product-variants");
const quantity = document.querySelector("#quantity");
const addToCartBtn =  document.querySelector(".add-to-cart");

let selectedVariant = null;

async function loadProduct() {
    if(!productHandle) {
        showError("Product not Found");
        return;
    }

    try {
        productLoading.hidden = false;
        productError.hidden = true;

        const product = await getProductsByHandle(productHandle);

        if(!product) {
            showError("Product not Found");
            return;
        }

        renderProduct(product);
        productLoading.hidden = true;
        productDetails.hidden = false;

    } catch(error) {
        console.error("Error loading product:",error);
        showError("Unable to load product. Please try again.");
    }
}

function renderProduct(product) {
    productImage.src = product.thumbnail || "";
    productImage.alt = product.title;

    productTitle.textContent = product.title;
    productDescription.textContent = product.description || "No Description Available";

    selectedVariant = product.variants?.[0];
    renderVariants(product);
    updatePrice();
}

function renderVariants(product) {
    productVariants.innerHTML = "";

    const options = product.options || [];
    const variants = product.variants || [];

    if(options.length === 0 || variants.length === 0) {
        productVariants.hidden = true;
        return;
    }
    productVariants.hidden = false; 

    options.forEach(option => {

        const optionGroup = document.createElement("div");
        optionGroup.className = "product-option";

        // Option title
        const optionTitle = document.createElement("h3");
        optionTitle.textContent = option.title;
        
        optionGroup.appendChild(optionTitle);

        const variantList = document.createElement("div");
        variantList.className = "variant-list";

        optionGroup.appendChild(variantList);

        // Option values
        option.values.forEach(value => {
        
            const button = document.createElement("button");
            button.className = "variant-option";
            button.textContent = value.value;

            button.addEventListener("click", ()=> {
                const matchingVariant = variants.find(variant => {
                    return variant.options.some(optionValue => {
                        return optionValue.value === value.value;
                    });
                });

                // Store selected variant
                if(matchingVariant) {
                    selectedVariant = matchingVariant;
                }

                // Update active button
                optionGroup.querySelectorAll('.variant-option')
                    .forEach(btn => {
                        btn.classList.remove("active");
                    });
                button.classList.add("active");

                updatePrice();

            });

            variantList.appendChild(button);
            
        });
        productVariants.appendChild(optionGroup);
    });

}

function updatePrice() {
    const price = selectedVariant?.calculated_price?.calculated_amount;

    if(price){
        productPrice.textContent = `₹${price}`;
    } else {
        productPrice.textContent = "Price Unavailable";
    }
}

function showError(message) {
    productLoading.hidden = true;
    productError.hidden = false;
    productDetails.hidden = true;
    productError.textContent = message;
}

addToCartBtn.addEventListener("click", async () => {
    const selectedQuantity = Number(quantity.value);

    try {
        const cart = await addToCart(selectedVariant.id ,selectedQuantity);    
        await updateCartCount();
        alert("Product added to Cart");

    } catch(error) {
        console.error(
            "Error adding product to cart:",
            error
        );

        alert("Unable to add product to cart");
    }
});

loadProduct()
