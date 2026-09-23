async function loadHeader() {

    const response = await fetch("./components/header.html");

    if(!response.ok) {
        throw new Error("Failed to load header");
    }

    const headerHtml = await response.text();

    document.querySelector("#header").innerHTML = headerHtml;

    initializeMobileMenu();
    initializeSearch();
}

loadHeader();


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
