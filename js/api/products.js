import products from "../../data/products.json" with { type: "json" };

export async function getProducts(categoryHandle = "") {
    
    if (!categoryHandle) {
        return products;
    }
    const filteredProducts = products.filter(product =>
        product.categories.some(
            category => category.handle === categoryHandle
        )
    );

    return filteredProducts;
}

export async function getProductsByHandle(productHandle) {
    const product = products.find(
        product => product.handle === productHandle
    );

    return product;
}