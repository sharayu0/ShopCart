export function initializeSlider({track, cards, prevBtn, nextBtn, dotsContainer, itemsPerView}) {
    
    let currentIndex = 0;

    function getCardsPerView() {
        if (window.innerWidth <= 480) {
            return itemsPerView.mobile;
        }
        if(window.innerWidth <= 1024) {
            return itemsPerView.tablet;
        }
        return itemsPerView.desktop;
    }

    function getMaxIndex() {

        const cardsPerView = getCardsPerView();
        return Math.max(
            0,
            cards.length - cardsPerView
        );
    }

    function updateSlider() {
        const cardsPerView = getCardsPerView();
        const gap = 14;

        const cardWidth = `calc((100% - ${(cardsPerView - 1) * gap}px) / ${cardsPerView})`;

        cards.forEach(card => {
            card.style.flex = `0 0 ${cardWidth}`;
        });

        const card = cards[0];
        if(!card) return;

        const moveAmount = card.offsetWidth + gap;

        track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;

        updateButtons();
        updateDots();
    }

    function updateButtons() {
        const maxIndex = getMaxIndex();
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    }

    nextBtn.addEventListener("click", ()=> {
        const maxIndex = getMaxIndex();
        if(currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener("click", ()=> {
        if(currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    function createDots() {
        dotsContainer.innerHTML = "";
        const maxIndex = getMaxIndex();

        for(let i=0; i<=maxIndex; i++) {
            const dot = document.createElement("button");
            dot.className = "slider-dot";

            dot.addEventListener("click", ()=> {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll(".slider-dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    window.addEventListener("resize", ()=> {
        const maxIndex = getMaxIndex();
        if(currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        createDots();
        updateSlider();
    });

    createDots();
    updateSlider();
}