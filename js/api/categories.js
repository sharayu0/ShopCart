import categories from "../../data/categories.json" with { type: "json" };

export async function getCategories() {
    // console.log(categories)
    return categories;
}