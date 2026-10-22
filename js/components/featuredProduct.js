import { createProductCard } from "./productCard.js";
import { initializeSlider } from "./slider.js";

export function renderFeaturedProducts(products) {

    const featuredContainer = document.querySelector("#featured-products");

    featuredContainer.innerHTML = `
        <div class="section-container">
            <div class="section-header">
                <div>
                    <p class="section-eyebrow">
                        Discover
                    </p>
                    <h2>Featured Products</h2>
                </div>

                <a href="products.html" class="view-all-link">
                    View All →
                </a>
            </div>

            <div class="product-slider">
                <button class="slider-btn button-prev" aria-label="Previous products">
                    &#10094;
                </button>

                <div class="product-viewport">

                    <div class="product-track"></div>

                </div>

                <button class="slider-btn button-next" aria-label="Next products">
                    &#10095;
                </button>
            </div>

            <div class="slider-dots"></div>

        </div>
    `;

    const track = featuredContainer.querySelector(".product-track");

    products.forEach(product =>{
        const card = createProductCard(product);

        track.appendChild(card);
    });

    initializeSlider({
        track,
        cards: featuredContainer.querySelectorAll(".product-card"),
        prevBtn: featuredContainer.querySelector(".button-prev"),
        nextBtn: featuredContainer.querySelector(".button-next"),
        dotsContainer: featuredContainer.querySelector(".slider-dots"),
        itemsPerView: {
            desktop: 5,
            tablet: 3,
            mobile: 2
        }
    });

}