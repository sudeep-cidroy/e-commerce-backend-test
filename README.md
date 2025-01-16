# Project: E-commerce Backend System

## Instructions for Candidate:
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Ensure local MongoDB is installed and running.
4. Start the server using `npm run dev`.
5. Complete the tasks mentioned in the "Tasks for the Candidate" section below.
6. Test the application using Postman or any REST client.

## Tasks for the Candidate:
1. **Implement a better caching strategy for the /products route.**
    - **Current behavior:** Products are cached for 60 seconds. However, the cache is cleared every time.
    - **Problem:** When multiple clients request `/products`, the database query is repeated unnecessarily, leading to slower performance.
    - **Your Task:** Improve the caching logic so that it handles updates and invalidates the cache only when necessary.

2. **Add a recursive task to calculate product category hierarchy (/categories/hierarchy/:categoryId).**
    - **Current Requirement:** Management wants to visualize product categories and subcategories in a tree-like structure.
    - **Your Task:** Implement a recursive function to build the hierarchy starting from a given category ID. Handle errors and edge cases properly.

3. **Calculate the total value of inventory (/inventory/value).**
    - **Current Requirement:** Management wants to know the total value of all products in stock.
    - **Your Task:** Use MongoDB aggregation to calculate and return the total inventory value as the sum of `(price * stock)` for all products.

4. **Implement a MongoDB aggregation pipeline to fetch top-selling products in the /top-products route.**
    - **Current Requirement:** Management wants to identify the top 5 most expensive products that are in stock.
    - **Your Task:** Use MongoDB aggregation to filter and sort the products, and return only the necessary fields.

5. **Implement nested comment functionality in the /comments route.**
    - **Current Requirement:** Implement a nested comment system where each comment can have multiple replies.
    - **Your Task:** Ensure comments can be linked to their parent comment and replies can be retrieved properly in a hierarchical structure.

6. **Organize the project files into a proper folder structure.**
    - **Current Problem:** All logic is in a single file, making it hard to maintain and scale.
    - **Your Task:** Refactor the project by splitting it into appropriate folders and files.
    - **Suggested structure:**
        - `routes/`: Place all route files (e.g., `products.ts`, `comments.ts`).
        - `models/`: Place all model definitions (e.g., `Product.ts`, `Comment.ts`).
        - `controllers/`: Place all controller logic (e.g., `productController.ts`, `commentController.ts`).
        - `utils/`: Place reusable utilities (e.g., caching logic).
    - Ensure the project works without errors after refactoring.
