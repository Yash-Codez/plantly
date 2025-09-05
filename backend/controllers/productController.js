import Product from "../models/productModel.js";

// Add product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, discount,stock, category } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discount,
       stock: stock ? Number(stock) : 0,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      createdBy: req.user._id,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
// Get all products (with optional search filters)
export const getProducts = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" }; // case-insensitive search
    }
    if (category) {
      query.category = category; // exact match for category
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).populate("createdBy", "username email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.discount = req.body.discount || product.discount;
         product.stock =
        req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
      product.category = req.body.category || product.category;

      if (req.file) {
        product.image = `/uploads/${req.file.filename}`;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

