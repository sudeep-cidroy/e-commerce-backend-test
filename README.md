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

### 7. Rate Limiting System
- **Problem:** Implement a rate limiting mechanism to prevent abuse of your API.
- **Scenario:** Your application has several endpoints, and you need to ensure fair usage by implementing rate limits.
- **Your Task:**
  - Design and implement a middleware to enforce rate limits per user or IP.
  - Allow up to 5 requests per user per minute.
  - Block further requests and respond with an appropriate error message if the limit is exceeded.
  - Track usage efficiently without significant performance overhead.

**Example Endpoint:**
- Any endpoint should include the rate limiting middleware.

**Example Response:**
- On success: Standard API response.
- On limit exceeded:
  ```json
  {
    "error": "Rate limit exceeded. Try again later."
  }
  ```
**Notes:**
- Implement an efficient in-memory or database-based rate limiting logic.
- Bonus: Extend the rate limiting mechanism to support flexible limits (e.g., different limits for different endpoints).

---

### 8. Product Recommendation System
- **Problem:** Store user preferences and recommend products.
- **Your Task:**
  - Design a schema to capture user preferences and history.
  - Write an endpoint to fetch recommendations for a user.

<!-- **Example Schema:**
- `UserPreferences`: { userId, category, weight }
- `UserHistory`: { userId, productId, timestamp }
- `Recommendations`: { userId, productId, score } -->

**Example Endpoint:**
- **GET /recommendations/:userId**

**Example Response:**
```json
[
  {
    "productId": 101,
    "score": 0.89
  },
  {
    "productId": 102,
    "score": 0.76
  }
]
```
**Notes:**
- Ensure recommendations are generated efficiently.
- Consider user preferences and purchase history while generating recommendations.

---

### 9. Version Control for Documents
- **Problem:** Implement a schema for document version control.
- **Your Task:**
  - Create a schema for documents to include version history, author, and metadata.
  - Write code to fetch the latest version and a specific version of a document.

**Example Schema:**
- `Documents`: { id, name }
- `DocumentVersions`: { id, documentId, version, content, author, timestamp }

**Example Endpoints:**
- **GET /documents/:documentId/latest**
  - Fetch the latest version of the document.
- **GET /documents/:documentId/version/:versionNumber**
  - Fetch a specific version of the document.

**Example Response:**
- Latest Version:
  ```json
  {
    "id": "123",
    "documentId": "456",
    "version": 5,
    "content": "Latest content here...",
    "author": "User A",
    "timestamp": "2025-01-01T12:00:00Z"
  }
  ```
- Specific Version:
  ```json
  {
    "id": "124",
    "documentId": "456",
    "version": 3,
    "content": "Content for version 3...",
    "author": "User B",
    "timestamp": "2025-01-01T10:00:00Z"
  }
  ```
**Notes:**
- Ensure versioning logic is robust and handles concurrency gracefully.

---

## Evaluation Criteria

### Cleanliness and Readability of Code (30%)
- Is the code well-structured and easy to read?
- Are best practices followed?

### Correctness of Solutions (40%)
- Does the code meet the task requirements?
- Are edge cases handled effectively?

### Problem-Solving Approach (20%)
- Does the solution demonstrate critical thinking and logical reasoning?
- Are the solutions efficient and scalable?

### Testing and Validation (10%)
- Are the solutions tested thoroughly?
- Are test cases and scenarios realistic?

