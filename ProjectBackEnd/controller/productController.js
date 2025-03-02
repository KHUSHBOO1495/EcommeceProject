const Feedback = require("../model/Feedback");
const Product = require("../model/Product");

const getAllProduct = async (req, res) => {
    try {
        const product = await Product.find().populate('discount_id').populate('category_id', 'category_name');
        if (!product) {
            res.status(404).json({ message: "Your product is empty!" });
        }

        const feedbacks = await Feedback.aggregate([
            {
                $group: {
                    _id: "$product_id",
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        const newProducts = product.map(product => {
            let finalPrice = product.product_price;
            let discountValue = 0;

            if (product.discount_id) {
                const { discount_type, discount_value, start_date, end_date } = product.discount_id;
                const currentDate = new Date();

                if (currentDate >= start_date && currentDate <= end_date) {
                    if (discount_type === "percentage") {
                        discountValue = (product.product_price * discount_value) / 100;
                    } else if (discount_type === "flat") {
                        discountValue = discount_value;
                    }

                    finalPrice = Math.max(product.product_price - discountValue, 0);
                }
            }

            const feedback = feedbacks.find(f => f._id.toString() === product._id.toString());

            return {
                _id: product._id,
                product_name: product.product_name,
                image_url: product.image_url,
                category_name: product.category_id.category_name,
                original_price: product.product_price,
                discount_value: discountValue,
                final_price: finalPrice,
                average_rating: feedback ? feedback.averageRating.toFixed(1) : "0.0",
                total_ratings: feedback ? feedback.totalRatings : 0
            };
        });

        res.status(200).json(newProducts);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('discount_id').populate('category_id', 'category_name');
        if (!product) {
            res.status(404).json({ message: "Your product is empty!" });
        }

        let finalPrice = product.product_price;
        let discountValue = 0;

        if (product.discount_id) {
            const { discount_type, discount_value, start_date, end_date } = product.discount_id;
            const currentDate = new Date();

            if (currentDate >= start_date && currentDate <= end_date) {
                if (discount_type === "percentage") {
                    discountValue = (product.product_price * discount_value) / 100;
                } else if (discount_type === "flat") {
                    discountValue = discount_value;
                }

                finalPrice = Math.max(product.product_price - discountValue, 0); // Ensure price doesn't go negative
            }
        }

        res.status(200).json({
            product,
            original_price: product.product_price,
            discount_value: discountValue,
            final_price: finalPrice
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createProduct = async (req, res) => {
    try {
        const { product_name, description, product_price, product_stock, image_url, category_id, discount_id, size } = req.body;

        if (!product_name || !product_price || !product_stock || !category_id || !size) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newProductData = {
            product_name,
            description,
            product_price,
            product_stock,
            image_url,
            category_id,
            size,
            created_at: Date.now(),
            updated_at: Date.now(),
        };

        if (discount_id) {
            newProductData.discount_id = discount_id;
        }

        const newProduct = new Product(newProductData);
        await newProduct.save();
            
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateProduct = async (req, res) => {
    try {
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
    try {
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