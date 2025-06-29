# E-commerce Client

This is the client-side of a full-stack e-commerce application, built with React and Vite.

## Features

*   User authentication (login/register)
*   Product browsing and searching
*   Shopping cart functionality
*   Stripe integration for payments
*   Admin panel for managing products, categories, and orders

## Getting Started

### Prerequisites

*   Node.js and npm (or yarn) installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the client directory:
    ```bash
    cd client
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

## Project Structure

```
/src
├── api/              # Functions for making API calls to the backend
├── assets/           # Static assets (images, svgs, etc.)
├── components/       # Reusable React components
├── layouts/          # Layout components (e.g., for admin, user, and general pages)
├── pages/            # Page components for different routes
├── routes/           # Route definitions and protected route components
├── store/            # Zustand store for state management
└── utils/            # Utility functions
```