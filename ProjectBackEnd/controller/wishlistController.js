const User = require("../model/User");
const Wishlist = require("../model/Wishlist");

const getAllWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find();
        if (!wishlist) {
            res.status(404).json({ message: "Your wishlist is empty!" });
        }
        res.status(200).json(wishlist);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getWishlistById = async (req, res) => {
    try {
        const uId = req.user.user_id;
        const user = await User.findById(uId);
        
        if(user.wishlist_id.toString() !== req.params.id){
            return res.status(403).json({ message: "Access denied. You can't access this wishlist." });
        }

        const wishlist = await Wishlist.findById(req.params.id);
        if (!wishlist) {
            res.status(404).json({ message: "Your wishlist is empty!" });
        }
        res.status(200).json(wishlist);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getProductFromWishlist = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const user = await User.findById(userId);
        const wishlist = await Wishlist.findOne(user.wishlist_id).populate('products.product_id')

        if (!wishlist) {
            res.status(404).json({ message: "Your wishlist is empty!" });
        }
        res.status(200).json(wishlist);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const insertProductInWishlist = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.user_id;
        const user = await User.findById(userId)
        
        let wishlist = await Wishlist.findOne(user.wishlist_id)
        if (!wishlist) {
            wishlist = new Wishlist({ products: [], quantity: 0 });
            user.wishlist_id = wishlist._id;
            await user.save();
        }

        const productAvailable = wishlist.products.findIndex(item => item.product_id.toString() === productId);
        if (productAvailable >= 0) {
            wishlist.products[productAvailable].quantity += quantity;
        } else {
            wishlist.products.push({ product_id: productId, quantity });
        }

        await wishlist.save();

        res.status(200).json({ message: 'Product inserted in wishlist' });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateWishlistProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const { id } = req.params;

        const wishlist = await Wishlist.findById(req.params.id)
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const productIndex = wishlist.products.findIndex(item => item.product_id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        wishlist.products[productIndex].quantity = quantity;
        wishlist.updated_at = Date.now();

        await Wishlist.findByIdAndUpdate(id, {
            products: wishlist.products,
            updated_at: wishlist.updated_at
        }, { new: true });

        res.status(200).json({ message: 'Wishlist updated successfully' });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteProductFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const wishlist = await Wishlist.findById(req.params.id)
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const productIndex = wishlist.products.findIndex(p => p.product_id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        wishlist.products.splice(productIndex, 1);
        wishlist.updated_at = Date.now();
        
        await wishlist.save();

        res.status(200).json({ message: 'Product from wishlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllWishlist, getWishlistById, getProductFromWishlist, updateWishlistProduct, deleteProductFromWishlist, insertProductInWishlist }