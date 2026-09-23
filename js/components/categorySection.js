import categoryImages from "./categoryImages.js";
import { initializeSlider } from "./slider.js";

export function renderCategories(categories) {
    const container = document.querySelector("#shop-categories");

    container.innerHTML = `
        <div class="section-container">

            <div class="section-header">

                <div>
                    <p class="section-eyebrow">
                        Browse Categories
                    </p>
                    <h2>
                        Shop by Category
                    </h2>
                    <p class="section-description">
                        Explore our wide range of products across different categories
                    </p>
                </div>

                <a href="categories.html" class="view-all-link">
                    View All Categories →
                </a>

            </div>

            <div class="category-slider">

                <button class="slider-btn button-prev" aria-label="Previous category">
                    &#10094;
                </button>

                <div class="category-viewport">
                    <div class="category-track"></div>
                </div>

                <button class="slider-btn button-next" aria-label="Next  category">
                    &#10095;
                </button>
            </div>
            <div class="slider-dots"></div>

        </div>
    `;

    const track = container.querySelector(".category-track");

    categories.forEach(category => {

        const image = categoryImages[category.handle] || "./assets/images/categories/default.jpg";

        const categoryCard = document.createElement('a');
        categoryCard.className = "category-card";

        categoryCard.href = `products.html?category=${encodeURIComponent(category.handle)}`;

        categoryCard.innerHTML = `
            <img src="${image}" alt="${category.name}" class="category-image" loading="lazy">

            <div class="category-overlay"></div>

            <div class="category-content">

                <div class="category-icon">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </div>

                <div class="category-text">
                    <h3>${category.name}</h3>

                    <span class="category-link">
                        Explore
                        <span class="arrow">→</span>
                    </span>
                </div>

            </div>
        `;
        track.appendChild(categoryCard);
    });

    initializeSlider({
        track,
        cards: container.querySelectorAll(".category-card"),
        prevBtn: container.querySelector(".button-prev"),
        nextBtn: container.querySelector(".button-next"),
        dotsContainer: container.querySelector(".slider-dots"),
        itemsPerView: {
            desktop: 5,
            tablet: 4,
            mobile: 3
        }
    });

}
