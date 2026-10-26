**ShopCart – E-Commerce Website**

ShopCart is a responsive e-commerce website built to demonstrate frontend development skills, including dynamic product rendering, product search, filtering, sorting, shopping cart management, and a demo checkout flow.

The website provides a simple online shopping experience where users can browse products, view product details, add products to their cart, and place demo orders.

**Features**

Responsive Design: Responsive shopping interface for desktop, tablet, and mobile devices.

Product Listing: Dynamically displays products using JSON data.

Product Details: Displays product information, images, prices, and available variants.

Product Search: Provides live search suggestions while typing and allows users to search products by title.

Category Filtering: Filters products by category.

Sorting: Sorts products by available sorting options, such as price and product title.

Shopping Cart: Add products, update quantities, remove items, and view the cart total.

Cart Persistence: Uses browser localStorage to retain cart items across page navigation and refreshes.

Checkout: Collects customer and shipping details.

Demo Shipping Options: Supports standard and express shipping with calculated shipping costs.

Demo Payment Flow: Simulates payment selection without processing real payments.

Order Confirmation: Saves demo orders locally and displays order confirmation.

Reusable Components: Uses JavaScript modules to organize header, product cards, product data, cart functionality, and page logic.

**Technologies Used**

HTML5

CSS3

JavaScript (ES6+)

JSON

Browser localStorage

Git and GitHub

**Project Structure**

ShopCart/
├── index.html
├── products.html
├── product-details.html
├── cart.html
├── checkout.html
├── order-confirmation.html
├── login.html
├── data/
│   ├── products.json
│   └── categories.json
├── css/
│   ├── header.css
│   ├── products.css
│   ├── cart.css
│   ├── checkout.css
│   └── ...
├── js/
│   ├── api/
│   │   ├── products.js
│   │   ├── categories.js
│   │   └── cart.js
│   ├── components/
│   │   ├── header.js
│   │   ├── productCard.js
│   │   └── ...
│   └── pages/
│       ├── home.js
│       ├── productsPage.js
│       ├── productDetailsPage.js
│       ├── cartPage.js
│       ├── checkoutPage.js
│       └── orderConfirmationPage.js
└── README.md

Note: Adjust the folder structure above to match the final structure of your repository.

Getting Started

**Prerequisites**

A modern web browser.

Visual Studio Code or another code editor.

A local development server, such as the VS Code Live Server extension.

**Installation**

Clone the repository:

git clone YOUR_GITHUB_REPOSITORY_URL

Navigate to the project directory:

cd ShopCart

Open the project in Visual Studio Code.

Start the website using Live Server or another local HTTP server.

Open the local URL provided by your development server.

Important: Run the project through a local server rather than opening index.html directly, because the website uses JavaScript modules and fetches JSON data.

How to Use

Open the ShopCart home page.

Browse products or explore product categories.

Enter a keyword in the search bar to see matching product suggestions.

Select a product to view its details and available variants.

Add products to the shopping cart.

Update quantities or remove items from the cart.

Proceed to checkout and enter customer details.

Select a shipping option and the demo payment method.

Place a demo order and view the order confirmation page.

**Data Storage and Checkout**

Product and category information is loaded from local JSON files. Cart items, checkout details, demo payment information, and orders are stored in the browser's localStorage.

The checkout flow is intended for demonstration purposes. It does not process real payments or create orders on a production backend. Stored data is browser-specific and can be cleared by the user.

**Author**

Sharayu Rajput

Frontend Developer

GitHub: https://github.com/sharayu0/

LinkedIn: https://www.linkedin.com/in/sharayu-rajput-266687137

Portfolio: https://shopcart-web-app.netlify.app/
