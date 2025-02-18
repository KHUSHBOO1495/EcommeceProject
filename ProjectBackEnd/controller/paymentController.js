const Razorpay = require("razorpay");
const Payment = require("../model/Payment");
const Order = require("../model/Order");
require("dotenv").config();

// Initialize Razorpay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
    try {
        const { order_id } = req.body;  // Order ID from the frontend

        // Fetch the order to get the total amount
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ message: "Order not found!" });
        }

        const amount = order.total_amount * 100;  // Razorpay expects amount in paise (1 INR = 100 paise)

        // Create a Razorpay payment order
        const razorpayOrder = await razorpayInstance.orders.create({
            amount: amount,
            currency: "INR",
            payment_capture: 1,  // Auto-capture
        });

        // Save the payment details
        const payment = new Payment({
            payment_method: "Razorpay",
            amount: order.total_amount,
            razorpay_order_id: razorpayOrder.id,
            payment_status: "Pending",
        });

        await payment.save();

        // Link payment_id to the order
        order.payment_id = payment._id;
        await order.save();

        res.status(200).json({
            message: "Payment order created successfully.",
            razorpay_order_id: razorpayOrder.id,
            payment_id: payment._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// API to Verify Razorpay Payment
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { payment_id, order_id, signature } = req.body;

        const payment = await Payment.findOne({ razorpay_order_id: order_id });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found!" });
        }

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(order_id + "|" + payment_id)
            .digest("hex");

        // Verify the signature
        if (generated_signature !== signature) {
            return res.status(400).json({ message: "Invalid signature!" });
        }

        // Update the payment status
        payment.payment_status = "Completed";
        payment.razorpay_payment_id = payment_id;
        payment.razorpay_signature = signature;

        await payment.save();

        // Update the order status to 'Paid'
        const order = await Order.findById(payment.order_id);
        order.order_status = "Paid";
        await order.save();

        res.status(200).json({ message: "Payment verified successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// API for Cash on Delivery (COD) Payment
const createCODPayment = async (req, res) => {
    try {
        const { order_id } = req.body;

        // Fetch the order
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ message: "Order not found!" });
        }

        // Create payment details for COD
        const payment = new Payment({
            payment_method: "COD",
            amount: order.total_amount,
            payment_status: "Pending",  // COD payment is always pending until delivery
        });

        await payment.save();

        // Link payment_id to the order
        order.payment_id = payment._id;
        await order.save();

        res.status(200).json({
            message: "COD payment created successfully.",
            payment_id: payment._id,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment, createCODPayment };
