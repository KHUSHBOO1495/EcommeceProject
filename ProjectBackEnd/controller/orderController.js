const Cart = require("../model/Cart");
const Coupon = require("../model/Coupon");
const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/User");

const getAllOrder = async (req, res) => {
    try {
        const order = await Order.find();
        if (!order) {
            return res.status(404).json({ message: "No order placed!" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOrderById = async (req, res) => {
    try {
        const uId = req.user.user_id;
        const order = await Order.findOne({ _id: req.params.id, is_deleted: false })
            .populate('order_items.product_id');

        if (!order) {
            return res.status(404).json({ message: "Order not found!" });
        }

        if (order.user_id.toString() !== uId || req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. You can't access this cart." });
        }

        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllOrderOfUser = async (req,res) => {
    try {
        const userId = req.user.user_id;
        const orders = await Order.find({ user_id: userId, is_deleted: false })
            .populate('order_items.product_id');

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found!" });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createOrderFromCart = async (req, res) => {
    try {
        const { shipping_address, coupon_code } = req.body;
        const user_id = req.user.user_id;

        if (!user_id || !shipping_address) {
            return res.status(400).json({ message: "User ID and shipping address are required" });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.address) {
            user.address = shipping_address;
            await user.save();
        }

        const cart = await Cart.findOne({_id:user.cart_id}).populate('products.product_id')
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let totalAmount = 0;
        let orderItems = [];

        for (const item of cart.products) {
            if (!item.product_id) continue;

            const product = item.product_id;
            totalAmount += product.product_price * item.quantity;

            if (product.product_stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.product_name}` });
            }
            product.product_stock -= item.quantity;
            await product.save();

            orderItems.push({
                product_id: product._id,
                quantity: item.quantity
            });
        }

        let coupon_id = null;
        let discountValue = 0;

        if (coupon_code) {
            const coupon = await Coupon.findOne({ coupon_code: coupon_code });

            if (!coupon || coupon.usage_limit <= 0 || new Date() > coupon.valid_to) {
                return res.status(400).json({ message: "Invalid or expired coupon" });
            }

            if (coupon.discount_type === "percentage") {
                discountValue = (totalAmount * coupon.discount_value) / 100;
            } else {
                discountValue = coupon.discount_value;
            }

            totalAmount = Math.max(totalAmount - discountValue, 0);
            coupon.usage_limit -= 1;
            await coupon.save();
            coupon_id = coupon._id;
        }

        const newOrder = new Order({
            user_id,
            shipping_address,
            order_items: orderItems,
            total_amount: totalAmount,
            order_status: "Pending",
            coupon_id,
            payment_id: null
        });

        await newOrder.save();

        cart.products = [];
        cart.quantity = 0;
        await cart.save();

        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createSingleOrder = async (req, res) => {
    try {
        const { product_id, quantity, shipping_address, coupon_code } = req.body;
        const user_id = req.user.user_id;

        if (!user_id || !product_id || !quantity || !shipping_address) {
            return res.status(400).json({ message: "User ID, Product ID, quantity, and shipping address are required" });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.address) {
            user.address = shipping_address;
            await user.save();
        }

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.product_stock < quantity) {
            return res.status(400).json({ message: `Insufficient stock for ${product.product_name}` });
        }

        let totalAmount = product.product_price * quantity;
        let coupon_id = null;
        let discountValue = 0;

        if (coupon_code) {
            const coupon = await Coupon.findOne({ coupon_code: coupon_code });

            if (!coupon || coupon.usage_limit <= 0 || new Date() > coupon.valid_to) {
                return res.status(400).json({ message: "Invalid or expired coupon" });
            }

            if (coupon.discount_type === "percentage") {
                discountValue = (totalAmount * coupon.discount_value) / 100;
            } else {
                discountValue = coupon.discount_value;
            }

            totalAmount = Math.max(totalAmount - discountValue, 0);
            coupon.usage_limit -= 1;
            await coupon.save();
            coupon_id = coupon._id;
        }

        product.product_stock -= quantity;
        await product.save();

        const newOrder = new Order({
            user_id,
            shipping_address,
            order_items: [{ product_id, quantity }],
            total_amount: totalAmount,
            order_status: "Pending",
            coupon_id,
            payment_id: null
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { order_status } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        const validStatuses = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(order_status)) {
            return res.status(400).json({ message: "Invalid order status." });
        }

        order.order_status = order_status;
        order.updated_at = Date.now();
        console.log(order.updated_at, Date.now());

        await order.save();
        res.status(200).json({ message: "Order status updated successfully.", order });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const softDeleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        order.is_deleted = true;
        await order.save();

        res.status(200).json({ message: "Order soft deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createOrderFromCart, createSingleOrder, getAllOrder, getOrderById, updateOrderStatus, getAllOrderOfUser, softDeleteOrder }