# API Endpoints Summary

This document provides a summary of the API endpoints available in the server.

## Admin

- `PUT /admin/order-status`: Change the order status. (Requires auth and admin privileges)
- `GET /admin/orders`: Get all orders for admin. (Requires auth and admin privileges)

## Auth

- `POST /register`: Register a new user.
- `POST /login`: Login an existing user.
- `POST /current-user`: Get the current user. (Requires auth)
- `POST /current-admin`: Get the current admin user. (Requires auth and admin privileges)

## Category

- `POST /category`: Create a new category. (Requires auth and admin privileges)
- `GET /category`: Get all categories.
- `DELETE /category/:id`: Delete a category by ID. (Requires auth and admin privileges)

## Product

- `POST /product`: Create a new product.
- `GET /products/:count`: Get a specific number of products.
- `GET /product/:id`: Get a product by ID.
- `PUT /product/:id`: Update a product by ID.
- `DELETE /product/:id`: Delete a product by ID.
- `POST /productby`: Get products by a certain condition.
- `POST /search/filters`: Search products with filters.
- `POST /images`: Create an image for a product. (Requires auth and admin privileges)
- `POST /removeimages`: Remove an image from a product. (Requires auth and admin privileges)

## Stripe

- `POST /user/create-payment-intent`: Create a payment intent for a user. (Requires auth)

## User

- `GET /users`: Get all users. (Requires auth and admin privileges)
- `POST /change-status`: Change the status of a user. (Requires auth and admin privileges)
- `POST /change-role`: Change the role of a user. (Requires auth and admin privileges)
- `POST /user/cart`: Add items to a user's cart. (Requires auth)
- `GET /user/cart`: Get a user's cart. (Requires auth)
- `DELETE /user/cart`: Empty a user's cart. (Requires auth)
- `POST /user/address`: Save a user's address. (Requires auth)
- `POST /user/order`: Create a new order for a user. (Requires auth)
- `GET /user/order`: Get a user's orders. (Requires auth)
