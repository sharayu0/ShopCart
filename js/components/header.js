import { getCart } from "../api/cart.js";
import { getProducts } from "../api/products.js";

async function loadHeader() {

    const response = await fetch("./components/header.html");

    if(!response.ok) {
        throw new Error("Failed to load header");
    }

    const headerHtml = await response.text();

    document.querySelector("#header").innerHTML = headerHtml;

    initializeMobileMenu();
    await initializeSearch();
    await updateCartCount();
}

loadHeader();

export async function updateCartCount() {
    const cartCount = document.querySelector("#cartCount");
    if(!cartCount) {
        return;
    }
    try {
        const cart = await getCart();
        if(!cart || !cart.items || cart.items.length === 0) {
            cartCount.textContent = 0;
            return;
        }
        const totalQuantity = cart.items.reduce((total, item) => {
           return total + item.quantity;
        }, 0);

        cartCount.textContent = totalQuantity;

    } catch(error) {
        console.error("Error loading cart count:", error);

        cartCount.textContent = 0;
    }
}

function initializeMobileMenu() {

    const menuBtn = document.querySelector('#mobileMenuBtn');
    const closeBtn = document.querySelector('#closeMobileMenu')
    const menu = document.querySelector("#mobileMenu");
    const overlay = document.querySelector("#headerOverlay");

    function openMenu() {
        menu.classList.add("active");
        overlay.classList.add("active");
        menuBtn.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        menu.classList.remove("active");
        overlay.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
    }

    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.addEventListener("click", openMenu);

    closeBtn.addEventListener("click", closeMenu);

    overlay.addEventListener("click", closeMenu);
}

async function initializeSearch() {
    const searchForm = document.querySelector("#searchForm");
    const searchInput = document.querySelector("#searchInput");
    const searchResult = document.querySelector("#searchResult");

    if (!searchForm || !searchInput || !searchResult) return;

    let products = [];

    // Load products using your existing API module.
    try {
        products = await getProducts();
    } catch (error) {
        console.error("Unable to load products for search:", error);
        return;
    }

    // Hide and clear suggestions.
    function hideSuggestions() {
        searchResult.innerHTML = "";
        searchResult.style.display = "none";
    }

    // Show suggestions as the user types.
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        showSuggestions(query);
    });


    // Display matching product titles.
    function showSuggestions(query) {
        searchResult.innerHTML = "";

        if (!query) {
            hideSuggestions();
            return;
        }

        const filteredProducts = products.filter(product =>
            product.title?.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            const message = document.createElement("div");
            message.className = "search-item";
            message.textContent = "No products found.";

            searchResult.appendChild(message);
            searchResult.style.display = "block";
            return;
        }

        filteredProducts.forEach(product => {
            const item = document.createElement("div");

            item.className = "search-item";
            item.textContent = product.title;

            item.addEventListener("click", () => {
                window.location.href =
                    `product-details.html?product=${encodeURIComponent(product.handle)}`;
            });

            searchResult.appendChild(item);
        });

        searchResult.style.display = "block";
    }

    // Submit the search to the products page.
    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        const query = searchInput.value.trim();

        if (!query) {
            searchInput.focus();
            hideSuggestions();
            return;
        }

        window.location.href =
            `products.html?search=${encodeURIComponent(query)}`;
    });

    // Hide suggestions when clicking outside.
    document.addEventListener("click", event => {
        if (
            !searchForm.contains(event.target) &&
            !searchResult.contains(event.target)
        ) {
            hideSuggestions();
        }
    });
}
