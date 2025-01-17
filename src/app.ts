// Project: E-commerce Backend System

// Instructions for Candidate:
// 1. Clone the repository.
// 2. Run `npm install` to install dependencies.
// 3. Start the server using `npm start`.
// 4. Complete the tasks mentioned in the "tasks" section below.
// 5. You can test the application using Postman or any REST client.

// Dependencies
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import NodeCache from 'node-cache';

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  maxPoolSize: 10,
  family: 4
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Models
interface IProduct {
  name: string;
  price: number;
  stock: number;
}
const ProductSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});
const Product = mongoose.model<IProduct>('Product', ProductSchema);

// Cache Setup
const cache = new NodeCache({ stdTTL: 60 });

// Routes

// 1. Get all products (with caching)
// Task: Enhance the caching logic to handle cache invalidation and periodic refreshing of the cache.
app.get('/products', async (req: Request, res: Response) => {
  try {
    const cacheKey = 'all_products';
    let products = cache.get<IProduct[]>(cacheKey);

    if (!products) {
      console.log("Cache miss: Fetching products from database");
      products = await Product.find();
      cache.set(cacheKey, products);
    } else {
      console.log("Cache hit: Fetching products from cache");
    }

    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});


app.post('/products', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, stock } = req.body;

    if (!name || typeof price !== 'number' || typeof stock !== 'number') {
      res.status(400).send('Invalid product data');
      return;
    }

    const newProduct = new Product({ name, price, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send('Error creating product');
  }
});

app.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, stock },
      { new: true }
    );

    if (!updatedProduct) {
      res.status(404).send('Product not found');
      return;
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).send('Error updating product');
  }
});



// 2. Buy a product (with race condition challenge)
// Task: Implement a locking mechanism or MongoDB transactions to handle concurrent requests properly.
app.post('/buy/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).send('Product not found');
      return;
    }

    if (product.stock < quantity) {
      res.status(400).send('Not enough stock');
      return;
    }

    // Simulate delay to test race conditions
    setTimeout(async () => {
      product.stock -= quantity;
      await product.save();
      res.send('Purchase successful');
    }, 2000);
  } catch (error) {
    res.status(500).send('Error buying product');
  }
});



// 3. Recursive Task: Calculate product category hierarchy
// Task: Implement a recursive function to build the hierarchy of categories starting from a given category ID.
interface ICategory {
  name: string;
  parent: mongoose.Types.ObjectId | null;
  subcategories: mongoose.Types.ObjectId[];
}

const CategorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

app.get('/categories/hierarchy/:categoryId', async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const buildHierarchy = async (categoryId: mongoose.Types.ObjectId | null): Promise<any> => {
      // Complete this function
    };

    const hierarchy = await buildHierarchy(new mongoose.Types.ObjectId(categoryId));
    res.json(hierarchy);
  } catch (error) {
    res.status(500).send('Error fetching category hierarchy');
  }
});





// 4. Aggregation Task: Top-selling products
// Task: Modify MongoDB aggregation pipeline to return the top 5 most expensive products and the product with the highest stock quantity.
app.get('/top-products', async (req: Request, res: Response) => {
  try {
    const topProducts = await Product.aggregate([
      { $match: { stock: { $gt: 0 } } },
      { $sort: { price: -1 } },
      { $limit: 5 },
      { $project: { name: 1, price: 1, stock: 1 } },
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).send('Error fetching top products');
  }
});

// 5. Nested comments API
// Task: Implement a nested comment system with hierarchical retrieval.
interface IComment {
  text: string;
  replies: mongoose.Types.ObjectId[];
}
const CommentSchema = new mongoose.Schema<IComment>({
  text: { type: String, required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});
const Comment = mongoose.model<IComment>('Comment', CommentSchema);

app.post('/comments', async (req: Request, res: Response): Promise<void> => {
  const { text, parentId } = req.body;

  try {
    const newComment = new Comment({ text, replies: [] });
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        res.status(404).send('Parent comment not found');
        return;
      }
      parentComment.replies.push(newComment._id);
      await parentComment.save();
    }
    await newComment.save();
    res.send(newComment);
  } catch (error) {
    res.status(500).send('Error creating comment');
  }
});

app.get('/comments', async (req: Request, res: Response) => {
  try {
    // Your Task: Retrieve all comments, including nested replies, in a hierarchical structure.

    const comments = await Comment.find().populate('replies');
    res.send(comments);
  } catch (error) {
    res.status(500).send('Error fetching comments');
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// 6. Organize the project files into a proper folder structure.
//    - Current Problem: All logic is in a single file, making it hard to maintain and scale.
//    - Your Task: Refactor the project by splitting it into appropriate folders and files.
//    - Suggested structure:
//      - `routes/`: Place all route files (e.g., `products.ts`, `comments.ts`).
//      - `models/`: Place all model definitions (e.g., `Product.ts`, `Comment.ts`).
//      - `controllers/`: Place all controller logic (e.g., `productController.ts`, `commentController.ts`).
//      - `utils/`: Place reusable utilities (e.g., caching logic).
//    - Ensure the project works without errors after refactoring.
