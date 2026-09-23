const API_URL = "http://localhost:9000";
const REGION_ID = "reg_01M1DZN9X26QJSFJ8FJ44Y601V";
const headers = {
    "x-publishable-api-key": "pk_f37013d933742a5966e5fb4d34e41d77c4004fd61e7f445c38314fc6b72863a4"
};

export async function getProducts(categoryId = "") {

    let url = `${API_URL}/store/products?region_id=${REGION_ID}&fields=*categories`;

    if (categoryId) {
        url += `&category_id=${categoryId}`;
    }
    const response = await fetch(url, { headers });

    if(!response.ok) {
        throw new Error("Unable to fetch products");
    }

    const data = await response.json();

    return data.products;
}

export async function getProductsByHandle(productHandle) {
    let url = `${API_URL}/store/products?handle=${encodeURIComponent(productHandle)}&region_id=${REGION_ID}`;

    const response = await fetch(url, {headers});

    if(!response.ok) {
        throw new Error("Unable to fetch product");
    }
    const data = await response.json();
    return data.products[0];
}