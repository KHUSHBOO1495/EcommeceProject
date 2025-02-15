const Product = require("../model/Product");

const getAllProduct = async (req, res) => {
    try{
        const product = await Product.find();
        if (!product) {
            res.status(404).json({ message: "Your product is empty!" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: "Your product is empty!" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createProduct = async (req, res) => {
    try{
        const { product_name, description, product_price, product_stock, image_url, category_id, discount_id } = req.body;
        
        if (!product_name || !product_price || !product_stock || !category_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newProduct = new Product({
            product_name,
            description,
            product_price,
            product_stock,
            image_url,
            category_id,
            discount_id,
            created_at: Date.now(),
            updated_at: Date.now()
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateProduct = async (req, res) => {
    try{
        const updateData = req.body;
        updateData.updated_at = Date.now();

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteProduct = async (req, res) => {
    try{
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = { getAllProduct, getProductById, updateProduct, createProduct, deleteProduct }