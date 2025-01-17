# Project: E-commerce Backend System

## Instructions for Candidate:
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Ensure local MongoDB is installed and running.
4. Start the server using `npm run dev`.
5. Complete the tasks mentioned in the "Tasks for the Candidate" section below.
6. Test the application using Postman or any REST client.

---

## Tasks for the Candidate

### 1. Implement an Enhanced Caching Strategy for the `/products` Route
- **Current behavior:** Products are cached for 60 seconds, but the entire cache is invalidated whenever a product is created or updated.
- **Problem:** This causes unnecessary invalidations and poor performance when only a small subset of products changes.
- **Your Task:**
  - Cache the full product list separately from individual product queries.
  - Invalidate the `all_products` cache when a new product is created or updated.
  - Cache individual products separately and update or invalidate their entries as needed.
- **API Details:**
  - **GET /products**
    - **Response:**
      ```json
      [
        { "id": "1", "name": "Product A", "price": 100, "stock": 50 },
        { "id": "2", "name": "Product B", "price": 150, "stock": 30 }
      ]
      ```

---

### 2. Buy a Product (with Race Condition Challenge)
- **Current Problem:** If multiple clients try to buy the same product simultaneously, the stock validation may fail, causing incorrect stock values.
- **Your Task:**
  - Implement a locking mechanism or use MongoDB transactions to handle concurrent requests properly.
  - Simulate a delay to observe potential race conditions.
- **API Details:**
  - **POST /buy/:id**
    - **Path Parameter:**
      - `id` (string): The ID of the product to purchase.
    - **Payload:**
      ```json
      {
        "quantity": 2
      }
      ```
    - **Responses:**
      - **Success:**
        ```json
        {
          "message": "Purchase successful"
        }
        ```
      - **Failure:**
        - `404` - Product not found.
        - `400` - Not enough stock.

---

### 3. Recursive Task: Calculate Product Category Hierarchy
- **Current Requirement:** Management wants to visualize product categories and subcategories in a tree-like structure.
- **Example:** A "Clothing" category might have subcategories like "Men's Wear" and "Women's Wear", and each subcategory could have further subcategories.
- **Your Task:**
  - Implement a recursive function to build the hierarchy of categories starting from a given category ID.
  - Ensure that the function efficiently handles deeply nested structures.
  - Handle errors, such as invalid category IDs, gracefully.
- **API Details:**
  - **GET /categories/hierarchy/:categoryId**
    - **Path Parameter:**
      - `categoryId` (string): The ID of the root category to fetch the hierarchy from.
    - **Response Example:**
      ```json
      {
        "id": "1",
        "name": "Clothing",
        "subcategories": [
          {
            "id": "2",
            "name": "Men's Wear",
            "subcategories": [
              { "id": "3", "name": "Shirts", "subcategories": [] },
              { "id": "4", "name": "Pants", "subcategories": [] }
            ]
          },
          {
            "id": "5",
            "name": "Women's Wear",
            "subcategories": [
              { "id": "6", "name": "Dresses", "subcategories": [] }
            ]
          }
        ]
      }
      ```

---

### 4. Aggregation Task: Top-Selling Products
- **Current Requirement:** Management wants to identify:
  - The top 5 most expensive products that are in stock.
  - The product with the highest quantity in stock.
- **Your Task:**
  - Modify the current MongoDB aggregation pipeline to return both:
    1. The top 5 most expensive products in stock.
    2. The product with the highest stock quantity.
  - Return only the fields required by the client.
- **API Details:**
  - **GET /top-products**
    - **Response Example:**
      ```json
      {
        "topExpensiveProducts": [
          { "id": "1", "name": "Product A", "price": 150, "stock": 10 },
          { "id": "2", "name": "Product B", "price": 140, "stock": 5 }
        ],
        "productWithHighestStock": {
          "id": "3",
          "name": "Product C",
          "price": 120,
          "stock": 100
        }
      }
      ```

---

### 5. Implement Nested Comment Functionality
- **Current Requirement:** Implement a nested comment system where each comment can have multiple replies.
- **Your Task:**
  - Ensure comments can be linked to their parent comment.
  - Retrieve comments in a hierarchical structure, including nested replies.
- **API Details:**
  - **POST /comments**
    - **Payload:**
      ```json
      {
        "text": "This is a comment",
        "parentId": "1" // Optional
      }
      ```
    - **Response:**
      ```json
      {
        "id": "2",
        "text": "This is a comment",
        "replies": []
      }
      ```
  - **GET /comments**
    - **Response:**
      ```json
      [
        {
          "id": "1",
          "text": "Parent Comment",
          "replies": [
            { "id": "2", "text": "Child Comment", "replies": [] }
          ]
        }
      ]
      ```

---

### 6. Organize the Project Files into a Proper Folder Structure
- **Current Problem:** All logic is in a single file, making it hard to maintain and scale.
- **Your Task:** Refactor the project by splitting it into appropriate folders and files.
- **Suggested structure:**
  - `routes/`: Place all route files (e.g., `products.ts`, `comments.ts`).
  - `models/`: Place all model definitions (e.g., `Product.ts`, `Comment.ts`).
  - `controllers/`: Place all controller logic (e.g., `productController.ts`, `commentController.ts`).
  - `utils/`: Place reusable utilities (e.g., caching logic).
- **Requirement:** Ensure the project works without errors after refactoring.

---


