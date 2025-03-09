const Cart = require("../model/Cart");
const User = require("../model/User");

const getAllCart = async (req, res) => {
    try {
        const cart = await Cart.find();
        if (!cart) {
            return res.status(404).json({ message: "Your cart is empty!" });
        }
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getCartById = async (req, res) => {
    try {
        const uId = req.user.user_id;
        const user = await User.findById(uId);
        
        if(user.cart_id.toString() !== req.params.id){
            return res.status(403).json({ message: "Access denied. You can't access this cart." });
        }

        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Your cart is empty!" });
        }
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getProductFromCart = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const user = await User.findById(userId);
        const cart = await Cart.findOne({_id:user.cart_id}).populate('products.product_id')

        if (!cart) {
            return res.status(404).json({ message: "Your cart is empty!" });
        }
        res.status(200).json(cart);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const insertProductInCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.user_id;
        const user = await User.findById(userId)
        let cart = await Cart.findOne({_id:user.cart_id})
        if (!cart) {
            cart = new Cart({ products: [], quantity: 0 });
            user.cart_id = cart._id;
            await user.save();
        }
        
        const productAvailable = cart.products.findIndex(item => item.product_id.toString() === productId);
        if (productAvailable >= 0) {
            cart.products[productAvailable].quantity += quantity;
        } else {
            cart.products.push({ product_id: productId, quantity });
        }

        cart.quantity = cart.products.reduce((total, product) => total + product.quantity, 0);
        await cart.save();

        return res.status(200).json({ message: 'Product inserted in cart' });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateCartProduct = async (req, res) => {
    try {
        const uId = req.user.user_id;
        const user = await User.findById(uId);
        
        if(user.cart_id.toString() !== req.params.id){
            return res.status(403).json({ message: "Access denied. You can't access this cart." });
        }
        
        const { productId, quantity } = req.body;
        const { id } = req.params;
        
        const cart = await Cart.findById(req.params.id)
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const productIndex = cart.products.findIndex(p => p._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cart.products[productIndex].quantity = quantity;
        cart.updated_at = Date.now();
        cart.quantity = cart.products.reduce((total, product) => total + product.quantity, 0);

        await Cart.findByIdAndUpdate(id, {
            products: cart.products,
            quantity: cart.quantity,
            updated_at: cart.updated_at
        }, { new: true });

        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteProductFromCart = async (req, res) => {
    try {
        const uId = req.user.user_id;
        const user = await User.findById(uId);
        
        if(user.cart_id.toString() !== req.params.id){
            return res.status(403).json({ message: "Access denied. You can't access this cart." });
        }
        
        const { productId } = req.body;
        
        const cart = await Cart.findById(req.params.id)
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const productIndex = cart.products.findIndex(p => p._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cart.products.splice(productIndex, 1);
        cart.updated_at = Date.now();
        cart.quantity = cart.products.reduce((total, product) => total + product.quantity, 0);

        await cart.save();

        res.status(200).json({ message: 'Product from cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllCart, getCartById, getProductFromCart, updateCartProduct, deleteProductFromCart, insertProductInCart }