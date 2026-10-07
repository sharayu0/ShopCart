import { getProducts } from "../api/products.js";
import { getCategories } from "../api/categories.js";
import { createProductCard } from "../components/productCard.js";

const urlParams = new URLSearchParams(window.location.search);
let categoryFromUrl = urlParams.get("category");
let searchFromUrl = urlParams.get("search");

const productsGrid = document.querySelector("#products-grid");
const productsLoading = document.querySelector("#products-loading");
const productsEmpty = document.querySelector("#products-empty");
const productsCount = document.querySelector("#products-count");
const categoryFilters = document.querySelector("#category-filters");
const clearFilters = document.querySelector("#clear-filters");
const sortProducts = document.querySelector("#sort-products");
const productsEmptyMessage = document.querySelector("#products-empty-message");

let currentProducts = [];
async function loadProductsPage() {

    try {
        productsLoading.hidden = false;
        productsEmpty.hidden = true;
       
        const categories = await getCategories();

        renderCategories(categories);

        const selectedCategory = categories.find(category => category.handle == categoryFromUrl);
        
        const categoryId = selectedCategory?.id || "";

        const products = await getProducts(categoryId);
       
        selectCategoryFromUrl();
        
        currentProducts = products;

        applyFiltersAndSort();
        loadProductsByCategory(categories);
        
        productsLoading.hidden = true;

    } catch(error) {
        console.error("Error loading products page:", error);

        productsLoading.textContent = "Unable to load products. Please try again.";
        productsCount.textContent = "Unable to load products.";
    }
}

function renderProducts(products) {
    
    productsGrid.innerHTML = "";

    if(searchFromUrl) {
        productsCount.textContent = `${products.length} ${products.length === 1 ? "Product" : "Products"} found for ${searchFromUrl}`;
    } else {
        productsCount.textContent = `${products.length} ${products.length === 1 ? "Product" : "Products"}`;
    }
    
    if(products.length === 0) {
        productsEmpty.hidden = false;

        if(searchFromUrl) {
            productsEmptyMessage.textContent = `No products found for "${searchFromUrl}".`;
        } else {
            productsEmptyMessage.textContent = "Try selecting another category.";
        }
        return;
    }

    productsEmpty.hidden = true;

    products.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
    
}

function applyFiltersAndSort() {

    let filteredProducts = [...currentProducts];

    // Search
    if(searchFromUrl) {

        const searchTerm = searchFromUrl.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm)
        );
    }

    // Sort
    const sortValue = sortProducts.value;

    if(sortValue === "title-asc") {
        filteredProducts.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    if(sortValue === "title-desc") {
        filteredProducts.sort((a, b) =>
            b.title.localeCompare(a.title)
        );
    }

    if(sortValue === "price-asc") {
        filteredProducts.sort((a, b) =>
            a.variants[0].calculated_price.calculated_amount -
            b.variants[0].calculated_price.calculated_amount
        );
    }

    if(sortValue === "price-desc") {
        filteredProducts.sort((a, b) =>
            b.variants[0].calculated_price.calculated_amount -
            a.variants[0].calculated_price.calculated_amount
        );
    }

    renderProducts(filteredProducts);
}

function renderCategories(categories) {
    categoryFilters.innerHTML = "";

    categories.forEach(category => {
        const wrapper = document.createElement("div");
        wrapper.className = 'category-filter';

        wrapper.innerHTML = `
            <input type="radio" name="category" id="category-${category.handle}" value="${category.handle}">
            <label for="category-${category.handle}">${category.name}</label>
        `;
        categoryFilters.appendChild(wrapper);
    });
}

function selectCategoryFromUrl() {
    if(!categoryFromUrl) {
        return;
    }
    const radioBtn = categoryFilters.querySelector(
        `input[value="${categoryFromUrl}"]`
    );
    if(radioBtn) {
        radioBtn.checked = true;
    }
}

function loadProductsByCategory(categories) {
    const radioButtons = categoryFilters.querySelectorAll('input[type="radio"]');
        
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', async () => {
            const categoryHandle = radioButton.value;

            const selectedCategory = categories.find(category => category.handle === categoryHandle);
            const categoryId = selectedCategory?.id;

             // Category is now active, so old search should be removed
            searchFromUrl = null;
            categoryFromUrl = categoryHandle;
           
            history.pushState(
                {}, 
                "", 
                `products.html?category=${categoryHandle}`
            );
           
            try {
                productsLoading.hidden = false;

                const products = await getProducts(categoryId);
                
                currentProducts = products;

                applyFiltersAndSort();

                productsLoading.hidden = true;

            }catch(error) {
                console.error("Error loading category products", error);
            } finally {
                productsLoading.hidden = true;
            }
        });
    }); 
}

async function clearCategoryFilter() {
    const selectedRadio = categoryFilters.querySelector(
        'input[type="radio"]:checked'
    );
    if(selectedRadio) {
        selectedRadio.checked = false;
    }
    sortProducts.value = "default";
    searchFromUrl = null;

    history.pushState({}, "", "products.html");

    try {
        productsLoading.hidden = false;
        let products = await getProducts();
        renderProducts(products);
        productsLoading.hidden = true;

    } catch(error) {
        console.error("Error Clearing category filter", error);
    }

}

clearFilters.addEventListener("click", clearCategoryFilter);

sortProducts.addEventListener('change', () => {
    applyFiltersAndSort();
});

loadProductsPage();
