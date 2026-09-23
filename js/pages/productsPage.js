import { getProducts } from "../api/products.js";
import { getCategories } from "../api/categories.js";
import { createProductCard } from "../components/productCard.js";

const urlParams = new URLSearchParams(window.location.search);
const categoryFromUrl = urlParams.get("category");

const productsGrid = document.querySelector("#products-grid");
const productsLoading = document.querySelector("#products-loading");
const productsEmpty = document.querySelector("#products-empty");
const productsCount = document.querySelector("#products-count");
const categoryFilters = document.querySelector("#category-filters");
const clearFilters = document.querySelector("#clear-filters");
const sortProducts = document.querySelector("#sort-products");

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
        
        renderProducts(products);
        
        loadProductsByCategory(categories);
        
        productsLoading.hidden = true;

    } catch(error) {
        console.error("Error loading products page:", error);

        productsLoading.textContent = "Unable to load products. Please try again.";
        productsCount.textContent = "Unable to load products.";
    }
}

function renderProducts(products) {
    currentProducts = products;
    productsGrid.innerHTML = "";

    productsCount.textContent = `${products.length} ${products.length === 1 ? "Product" : "Products"}`;

    if(products.length === 0) {
        productsEmpty.hidden = false;
        return;
    }
    productsEmpty.hidden = true;

    products.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
    
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
           
            history.pushState(
                {}, 
                "", 
                `products.html?category=${categoryHandle}`
            );
           
            try {
                productsLoading.hidden = false;

                const products = await getProducts(categoryId);
                
                renderProducts(products);

                productsLoading.hidden = true;

            }catch(error) {
                console.log("Error loading category products",error);
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
    sortProducts.value = "";

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

function sortCurrentProducts(sortValue) {
    const sortedProducts = [...currentProducts];
    
    if(sortValue === 'title-asc') {
        sortedProducts.sort((a,b) =>
            a.title.localeCompare(b.title)
        );
    }

    if(sortValue === 'title-desc') {
        sortedProducts.sort((a,b) =>
            b.title.localeCompare(a.title)
        );
    }
    renderProducts(sortedProducts);
}

sortProducts.addEventListener('change', () => {
    const sortValue = sortProducts.value;
    sortCurrentProducts(sortValue);
})

loadProductsPage();
