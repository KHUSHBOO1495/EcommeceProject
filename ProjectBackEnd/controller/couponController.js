const Coupon = require("../model/Coupon");
const Order = require("../model/Order");

const getAllCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        if (!coupons) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getAllActiveCoupon = async (req, res) => {
    try {
        const currentDate = new Date();

        const activeCoupons = await Coupon.find({
            valid_from: { $lte: currentDate },
            valid_to: { $gte: currentDate }
        });

        if (activeCoupons === 0) return res.status(404).json({ message: "No valid coupon available" });

        res.status(200).json(activeCoupons);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createCoupon = async (req, res) => {
    try {
        const { coupon_code, discount_type, discount_value, valid_from, valid_to, usage_limit } = req.body;

        if (!coupon_code || !discount_type || !discount_value || !valid_from || !valid_to || !usage_limit) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const validTypes = ["percentage", "flat"];
        if (!validTypes.includes(discount_type)) {
            return res.status(400).json({ message: "Invalid discount type. Use 'percentage' or 'flat'." });
        }

        if (discount_value <= 0) {
            return res.status(400).json({ message: "Discount value must be greater than zero." });
        }

        if (new Date(valid_from) >= new Date(valid_to)) {
            return res.status(400).json({ message: "Valid from date must be before valid to date" });
        }

        const existingCoupon = await Coupon.findOne({ coupon_code });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const newCoupon = new Coupon({
            coupon_code,
            discount_type,
            discount_value,
            valid_from,
            valid_to,
            usage_limit
        });

        await newCoupon.save();
        res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;

        const existingCoupon = await Coupon.findById(id);
        if (!existingCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        if (updates.coupon_code && updates.coupon_code !== existingCoupon.coupon_code) {
            const existingCode = await Coupon.findOne({ coupon_code: updates.coupon_code });
            if (existingCode) {
                return res.status(400).json({ message: "Coupon code already exists. Choose a unique one." });
            }
        }

        if (updates.discount_type) {
            const validTypes = ["percentage", "flat"];
            if (!validTypes.includes(updates.discount_type)) {
                return res.status(400).json({ message: "Invalid coupon type. Use 'percentage' or 'flat'." });
            }
        }

        if (updates.discount_value !== undefined && updates.discount_value <= 0) {
            return res.status(400).json({ message: "Coupon value must be greater than zero." });
        }

        let newStartDate = updates.valid_from ? new Date(updates.valid_from) : existingCoupon.valid_from;
        let newEndDate = updates.valid_to ? new Date(updates.valid_to) : existingCoupon.valid_to;

        if (newStartDate >= newEndDate) {
            return res.status(400).json({ message: "End date must be greater than start date." });
        }

        const usedCount = await Order.countDocuments({ coupon_id: id });
        if (updates.usage_limit !== undefined && updates.usage_limit < usedCount) {
            return res.status(400).json({ message: `Usage limit cannot be less than ${usedCount} (already used).` });
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json({ message: "Discount updated successfully", discount: updatedCoupon });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const existingCoupon = await Coupon.findById(id);
        if (!existingCoupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        await Coupon.findByIdAndDelete(id);
        res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllCoupon, getAllActiveCoupon, createCoupon, updateCoupon, deleteCoupon }