# 🛒 ShopCart — E-commerce Web Application

ShopCart is a responsive e-commerce web application built to demonstrate modern frontend development skills using **HTML, CSS, and JavaScript**, with **Medusa.js** used as the backend commerce platform.

The application includes product browsing, search, category filtering, sorting, shopping cart management, shipping selection, payment selection, and checkout/order flow.

## 🚀 Live Demo

**Live Website:** Coming Soon

**GitHub Repository:**
[https://github.com/sharayu0](https://github.com/sharayu0)

---

## 📸 Screenshots

### Home Page
<img width="1366" height="639" alt="Screenshot (36)" src="https://github.com/user-attachments/assets/ac549228-cfd1-4cfa-b0bb-12431aceaf57" />

<img width="1068" height="531" alt="Screenshot (42)" src="https://github.com/user-attachments/assets/275d691b-c407-4261-9a0b-771ef0403c0c" />

<img width="953" height="634" alt="Screenshot (38)" src="https://github.com/user-attachments/assets/dab99cef-761e-4136-871b-5438d881cc26" />

### Products Page

<img width="936" height="635" alt="Screenshot (43)" src="https://github.com/user-attachments/assets/a40bccfe-b1ba-4f2e-877d-239f18909924" />

### Shopping Cart

<img width="1079" height="633" alt="Screenshot (45)" src="https://github.com/user-attachments/assets/e054224b-06a8-4ac4-bf1e-a78351028086" />

### Checkout

<img width="443" height="557" alt="Screenshot (46)" src="https://github.com/user-attachments/assets/ab5db2fc-743c-448d-a72a-4717596b9740" />

### Login

<img width="909" height="636" alt="Screenshot (47)" src="https://github.com/user-attachments/assets/ef7e92d9-b6a9-46d4-bce2-412d1de23459" />

---

## ✨ Features

### 🏠 Homepage

- Responsive navigation header
- Hero image slider
- Product categories slider section
- Featured products
- Responsive layout for desktop, tablet, and mobile

### 🛍️ Product Listing

- Fetches products from the backend API
- Category-based product filtering
- Product search
- Product sorting
  - Price: Low to High
  - Price: High to Low
  - Name: A to Z
  - Name: Z to A
- Responsive product grid
- Empty-state handling when no products are found

### 🛒 Shopping Cart

- Add products to cart
- Persistent cart using `localStorage`
- Display cart items
- Increase/decrease product quantity
- Remove products from cart
- Automatic subtotal calculation
- Total item quantity
- Dynamic cart count in the header
- Empty cart state

### 💳 Checkout

- Customer information form
- Shipping method selection
- Payment provider selection
- Order summary
- Order placement
- Order confirmation page

### 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile devices

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- CSS Flexbox
- CSS Grid
- Responsive Design
- Fetch API
- ES Modules
- LocalStorage

### Backend

- Medusa.js
- REST APIs

### Development Tools

- Git
- GitHub
- Visual Studio Code
- Browser Developer Tools

---

## 🔄 How the Application Works

### Product Flow

```text
User visits ShopCart
        ↓
Products are requested from Medusa API
        ↓
Products are displayed on the frontend
        ↓
User searches / filters / sorts products
        ↓
User selects a product
        ↓
Product is added to cart
```

### Cart Flow

```text
Add Product
     ↓
Create / Retrieve Cart
     ↓
Store Cart ID in localStorage
     ↓
Add Product to Medusa Cart
     ↓
Display Cart Items
     ↓
Update Quantity / Remove Item
     ↓
Update Cart Total
```

### Checkout Flow

```text
Shopping Cart
      ↓
Checkout
      ↓
Customer Information
      ↓
Shipping Method
      ↓
Payment Method
      ↓
Order Summary
      ↓
Place Order
      ↓
Order Confirmation
```

---

## 🔌 API Integration

ShopCart communicates with the Medusa backend through REST APIs.

Examples of API operations used in the project include:

### Products

```text
GET /store/products
```

Used to retrieve products from the backend.

### Cart

```text
POST /store/carts
GET /store/carts/:cartId
POST /store/carts/:cartId/line-items
POST /store/carts/:cartId/line-items/:lineItemId
DELETE /store/carts/:cartId/line-items/:lineItemId
```

These APIs are used for creating and managing the shopping cart.

### Shipping

```text
GET /store/shipping-options
POST /store/carts/:cartId/shipping-methods
```

### Payment

```text
GET /store/payment-providers
POST /store/payment-collections
POST /store/payment-collections/:id/payment-sessions
```

### Order

```text
POST /store/carts/:cartId/complete
GET /store/orders/:orderId
```

---

## 🧠 Key JavaScript Concepts Used

This project demonstrates practical JavaScript concepts including:

- Variables and constants
- Functions
- Arrow functions
- Array methods
  - `map()`
  - `filter()`
  - `find()`
  - `forEach()`
  - `sort()`
- DOM manipulation
- Event listeners
- Event handling
- Template literals
- Destructuring
- Optional chaining
- Async/await
- Promises
- Fetch API
- Error handling with `try...catch`
- ES modules
- `localStorage`
- URL parameters using `URLSearchParams`
- Dynamic rendering
- Form validation

---

## 🔍 Product Filtering and Sorting

The products page supports multiple ways to find products.

### Search

Products can be searched by their title.

### Category Filter

Users can filter products by category.

### Sorting

Products can be sorted by:

- Name: A → Z
- Name: Z → A
- Price: Low → High
- Price: High → Low

The filtering and sorting logic is handled on the frontend using JavaScript array methods.

---

## 💾 Cart Persistence

The cart ID is stored in the browser's `localStorage`.

```javascript
localStorage.setItem("cartId", cart.id);
```

When the user returns to the application, the stored cart ID can be retrieved:

```javascript
const cartId = localStorage.getItem("cartId");
```

This allows the application to maintain the user's cart across page navigation and browser refreshes.

---

## ⚠️ Error Handling

The application handles API and user interaction errors using `try...catch`.

For example:

```javascript
try {
    const cart = await getCart();
    displayCart(cart);
} catch (error) {
    console.error("Error loading cart:", error);
}
```

User-facing messages are also displayed when important operations such as loading products, updating the cart, or placing an order fail.

---

## 💻 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

The frontend also requires a running Medusa backend.

### 1. Clone the repository

```bash
git clone https://github.com/sharayu0/ShopCart.git
```

### 2. Open the project

```bash
cd ShopCart
```

### 3. Start the Medusa backend

Navigate to your backend project and start the development server.

```bash
npm run dev
```

The backend should be available at:

```text
http://localhost:9000
```

### 4. Start the frontend

Open the frontend using a local development server such as **VS Code Live Server**.

For example:

```text
http://127.0.0.1:5500
```

### 5. Open ShopCart

Open:

```text
index.html
```

in the browser through the local development server.

---

## 🔐 Environment Configuration

The frontend communicates with the Medusa backend through the API configuration.

For local development, the backend URL is configured as:

```text
http://localhost:9000
```

For production deployment, the API URL should be changed to the deployed backend URL rather than using `localhost`.

> Never expose Medusa secret/admin API credentials in frontend code. Only public/publishable configuration should be used by the browser.

---

## 📱 Responsive Design

The UI has been designed with responsive layouts for different screen sizes.

The project uses:

- CSS Grid
- Flexbox
- Media queries
- Responsive images
- Flexible containers
- Mobile navigation

The interface has been tested across desktop, tablet, and mobile screen sizes.

---

## 🎯 Project Goals

The main goals of this project were to:

- Build a complete e-commerce frontend
- Practice JavaScript through a real-world project
- Work with REST APIs
- Integrate a commerce backend
- Build reusable frontend components
- Implement cart and checkout functionality
- Practice responsive web design
- Improve frontend problem-solving skills
- Build a production-style portfolio project

---

## 📚 What I Learned

Through this project, I gained practical experience with:

- Building multi-page frontend applications
- Working with REST APIs
- Integrating a headless commerce backend
- Managing asynchronous JavaScript operations
- Handling API errors
- Managing application state with JavaScript
- Persisting data using `localStorage`
- Building dynamic product interfaces
- Implementing filtering and sorting
- Creating cart functionality
- Implementing checkout flows
- Creating responsive layouts
- Organizing JavaScript into modules
- Debugging frontend and API issues

---

## 👩‍💻 Author

**Sharayu Rajput**

Frontend Developer | HTML | CSS | JavaScript | React

GitHub:
[https://github.com/sharayu0](https://github.com/sharayu0)

---
