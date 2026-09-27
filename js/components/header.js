import { getCart } from "../api/cart.js";

async function loadHeader() {

    const response = await fetch("./components/header.html");

    if(!response.ok) {
        throw new Error("Failed to load header");
    }

    const headerHtml = await response.text();

    document.querySelector("#header").innerHTML = headerHtml;

    initializeMobileMenu();
    initializeSearch();
    updateCartCount();
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
    }

    function closeMenu() {
        menu.classList.remove("active");
        overlay.classList.remove("active");
    }

    menuBtn.addEventListener("click", openMenu);

    closeBtn.addEventListener("click", closeMenu);

    overlay.addEventListener("click", closeMenu);
}

function initializeSearch() {

    const searchForm = document.querySelector("#searchForm");
    const searchInput = document.querySelector("#searchInput");

    searchForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const query = searchInput.value.trim();

        if(!query) {
            return;
        }
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    });
}
