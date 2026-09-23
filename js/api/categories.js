const MEDUSA_URL = "http://localhost:9000";
const headers = {
    "x-publishable-api-key": "pk_f37013d933742a5966e5fb4d34e41d77c4004fd61e7f445c38314fc6b72863a4"
};

export async function getCategories() {
    
    const response = await fetch(
        `${MEDUSA_URL}/store/product-categories?limit=20`,
        { headers }
    );

    if(!response.ok) {
        throw new Error("Failed to load categories");
    }
    const data = await response.json();
    
    return data.product_categories;
}