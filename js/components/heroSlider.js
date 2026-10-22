const heroSlider = document.querySelector("#heroSlider");

async function loadSlides() {
    const response = await fetch("./data/banners.json");
    const slides = await response.json();

    renderSlider(slides);
}
loadSlides();

function renderSlider(slides) {
    
    let sliderdiv = "";
    slides.forEach(slide => {
        sliderdiv += `<img src = "${slide.img}" class="slide" alt = "${slide.alt}"></img>`;
    });

    heroSlider.innerHTML = `
        <div class="slider">
            <div class="slides" id="slides"> 
                ${sliderdiv}
            </div>
            <button class="prev" aria-label="Previous slide">&#10094</button>
            <button class="next" aria-label="Next slide">&#10095</button>
        </div>
    `;

    initializeHeroSlider();
}

function initializeHeroSlider() {
    const slidesContainer = heroSlider.querySelector(".slides")
    const prev_btn = heroSlider.querySelector(".prev");
    const next_btn = heroSlider.querySelector(".next");
    let slides = heroSlider.querySelectorAll(".slide");

    // clone first slide
    let firstClone = slides[0].cloneNode(true);
    slidesContainer.appendChild(firstClone);

    // clone last slide
    let lastClone = slides[slides.length-1].cloneNode(true);
    slidesContainer.insertBefore(lastClone, slidesContainer.firstChild);

    // update slides
    slides = heroSlider.querySelectorAll(".slide");

    //  NO animation at start
    slidesContainer.style.transition = 'none';

    let n = 1;
    
    function changeSlide() {
        slidesContainer.style.transform = `translateX(-${n*100}%)`;
    }
    changeSlide();

    prev_btn.addEventListener("click", () => {
        n--;
        changeSlide();
        slidesContainer.style.transition = "transform 0.5s ease";
    });

    next_btn.addEventListener("click", () => {
        n++;
        changeSlide();
        slidesContainer.style.transition = "transform 0.5s ease";
    });

    // infinite loop fix (both sides)
    slidesContainer.addEventListener("transitionend", () => {
        if(n === slides.length-1) {
            slidesContainer.style.transition = "none";
            n = 1;
            changeSlide();
        }
        if(n === 0) {
            slidesContainer.style.transition = "none";
            n = slides.length-2;
            changeSlide();
        }
    });

    let autoSlide;
    function startAutoSlide() {
        autoSlide = setInterval(() => {
            n++;
            changeSlide();
            slidesContainer.style.transition = "transform 0.5s ease";

            if( n >= slides.length-1) {
                setTimeout(() => {
                    slidesContainer.style.transition = "none";
                    n = 1;
                    changeSlide();
                }, 500)
            }
        }, 4000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }
    startAutoSlide();

    slidesContainer.addEventListener("mouseenter", () => {
        stopAutoSlide();
    });

    slidesContainer.addEventListener("mouseleave", () => {
        startAutoSlide();
    }); 
}
