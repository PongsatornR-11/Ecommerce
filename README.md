# Ecommerce Project

This is a full-stack ecommerce application built with the MERN stack (MySql, Express.js, React, Node.js) and other modern technologies.

## Features

*   **User Authentication:** Secure user registration and login.
*   **Product Management:** Admins can create, read, update, and delete products.
*   **Category Management:** Admins can organize products into categories.
*   **Shopping Cart:** Users can add products to their cart and manage it.
*   **Checkout:** Seamless and secure payment processing with Stripe.
*   **Order Management:** Admins can view and manage customer orders.
*   **Admin Dashboard:** A dedicated interface for managing the store.
*   **Search Functionality:** Users can easily find products.

## Technologies Used

### Frontend

*   **React:** A JavaScript library for building user interfaces.
*   **Vite:** A fast build tool for modern web development.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **Zustand:** A small, fast, and scalable state-management solution.
*   **Stripe.js:** For secure payment processing.

### Backend

*   **Node.js:** A JavaScript runtime for building server-side applications.
*   **Express.js:** A web application framework for Node.js.
*   **Prisma:** A next-generation ORM for Node.js and TypeScript.
*   **Postman:** Used for API testing and documentation (see `Ecommerce.postman_collection.json`).

## Getting Started

### Prerequisites

*   Node.js and npm (or yarn) installed on your machine.
*   A database supported by Prisma (e.g., PostgreSQL, MySQL, SQLite).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Ecommerce
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Environment Variables

You will need to create `.env` files in both the `client` and `server` directories.

*   **`server/.env`:**
    ```
    DATABASE_URL="your-database-connection-string"
    STRIPE_SECRET_KEY="your-stripe-secret-key"
    JWT_SECRET="your-jwt-secret"
    ```

*   **`client/.env`:**
    ```
    VITE_API_URL="http://localhost:5000/api"
    VITE_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
    ```

## Usage

1.  **Start the server:**
    ```bash
    cd server
    npm run dev
    ```
    The server will run on `http://localhost:5000`.

2.  **Start the client:**
    ```bash
    cd client
    npm run dev
    ```
    The client will run on `http://localhost:5173`.

## API

The API endpoints are defined in the `server/routes` directory. You can use the `Ecommerce.postman_collection.json` file to test the API with Postman.
