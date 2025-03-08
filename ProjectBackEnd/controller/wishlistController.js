const Product = require("../model/Product");
const User = require("../model/User");
const Wishlist = require("../model/Wishlist");

const getAllWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find();
        if (!wishlist) {
            return res.status(404).json({ message: "Your wishlist is empty!" });
        }
        return res.status(200).json(wishlist);

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getWishlistById = async (req, res) => {
    try {
        const uId = req.user.user_id;
        const user = await User.findById(uId);

        if (user.wishlist_id.toString() !== req.params.id) {
            return res.status(403).json({ message: "Access denied. You can't access this wishlist." });
        }

        const wishlist = await Wishlist.findById(req.params.id);
        if (!wishlist) {
            return res.status(404).json({ message: "Your wishlist is empty!" });
        }
        return res.status(200).json(wishlist);

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


const getProductFromWishlist = async (req, res) => {
    try {
        const userId = req.user.user_id;
        
        const user = await User.findById(userId);
        const wishlist = await Wishlist.findOne({ _id: user.wishlist_id }).populate('products.product_id');

        if (!wishlist) {
            return res.status(404).json({ message: "Your wishlist is empty!" });
        }

        return res.status(200).json(wishlist);

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const itemToggle = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.user_id;
        const user = await User.findById(userId)

        let wishlist = await Wishlist.findOne({_id: user.wishlist_id})
        if (!wishlist) {
            wishlist = new Wishlist({ products: [] });
            user.wishlist_id = wishlist._id;
            await user.save();
        }

        wishlist.updated_at = Date.now();

        const productIndex = wishlist.products.findIndex(p => p.product_id.toString() === productId);
        if (productIndex === -1) {
            wishlist.products.push({ product_id: productId });

            await wishlist.save();

            return res.status(200).json({ message: 'Product inserted in wishlist', status: true });

            // return res.status(404).json({ message: 'Product inserted in wishlist' });
        } else {
            wishlist.products.splice(productIndex, 1);
            wishlist.updated_at = Date.now();

            await wishlist.save();

            return res.status(200).json({ message: 'Product removed from wishlist',status: false });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllWishlist, getWishlistById, getProductFromWishlist, itemToggle }