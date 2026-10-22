async function loadFooter() {

    const response = await fetch("./components/footer.html");

    if (!response.ok) {
        throw new Error("Failed to load footer");
    }

    const footerHtml = await response.text();
    document.querySelector("#footer").innerHTML = footerHtml;
}

loadFooter();