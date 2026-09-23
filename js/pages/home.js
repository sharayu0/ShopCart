import { getProducts } from '../api/products.js';
import { getCategories } from '../api/categories.js';
import { renderCategories } from '../components/categorySection.js';
import { renderFeaturedProducts } from "../components/featuredProduct.js";

async function loadHomePage() {
    try {

        const [products,categories] = await Promise.all([
            getProducts(),
            getCategories()
        ]);

        renderCategories(categories);

        renderFeaturedProducts(products);
    }
    catch(error) {
        console.error("Error Loading Home page", error);
    }
}

loadHomePage();