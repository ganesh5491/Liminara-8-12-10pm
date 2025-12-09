/**
 * Product Management Controller
 * Handles CRUD operations for products in admin panel
 */

const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '../../data/products.json');

// Read JSON file safely
const readJSON = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Write JSON file safely
const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = readJSON(productsFile);
    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const products = readJSON(productsFile);
    const product = products.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { name, description, price, category, subcategory, images, stock, sku, tags } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const products = readJSON(productsFile);

    const newProduct = {
      id: Date.now().toString(),
      name,
      description,
      price: parseFloat(price),
      category,
      subcategory,
      images: images || [],
      stock: parseInt(stock) || 0,
      sku: sku || '',
      tags: tags || [],
      rating: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.push(newProduct);
    writeJSON(productsFile, products);

    res.status(201).json({
      message: 'Product created',
      product: newProduct,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { name, description, price, category, subcategory, images, stock, sku, tags } = req.body;

    const products = readJSON(productsFile);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[productIndex];

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (category !== undefined) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (images !== undefined) product.images = images;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (sku !== undefined) product.sku = sku;
    if (tags !== undefined) product.tags = tags;

    product.updatedAt = new Date().toISOString();

    writeJSON(productsFile, products);

    res.json({
      message: 'Product updated',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;

    const products = readJSON(productsFile);
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    writeJSON(productsFile, products);

    res.json({
      message: 'Product deleted',
      product: deletedProduct,
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

module.exports = exports;
