const Discount = require("../model/Discount");

const getAllDiscount = async (req, res) => {
    try {
        const discount = await Discount.find();
        if (!discount) {
            res.status(404).json({ message: "Discount not found" });
        }
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getDiscountById = async (req, res) => {
    try {
        const discount = await Discount.findById(req.params.id);

        if (!discount) return res.status(404).json({ message: "Discount not found" });
        res.json(discount);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getAllActiveDiscount = async (req, res) => {
    try {
        const discount = await Discount.find();
        const currentDate = new Date();

        if (!discount) return res.status(404).json({ message: "Discount not found" });

        const activeDiscounts = discount.map((item) => {
            if (currentDate >= item.start_date && currentDate <= item.end_date) {
                return item;
            }
        })

        if (!discount) return res.status(404).json({ message: "Active discount not found" });

        res.status(200).json(activeDiscounts);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createDiscount = async (req, res) => {
    try {
        const { discount_type, discount_value, start_date, end_date } = req.body;

        const validTypes = ["percentage", "flat"];
        if (!validTypes.includes(discount_type)) {
            return res.status(400).json({ message: "Invalid discount type. Use 'percentage' or 'flat'." });
        }

        if (discount_value <= 0) {
            return res.status(400).json({ message: "Discount value must be greater than zero." });
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({ message: "End date must be greater than start date." });
        }
        const newDiscount = new Discount({
            discount_type,
            discount_value,
            start_date,
            end_date
        });

        await newDiscount.save();
        res.status(201).json({ message: "Discount created successfully", discount: newDiscount });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        let updates = req.body;

        const existingDiscount = await Discount.findById(id);
        if (!existingDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        if (updates.discount_type) {
            const validTypes = ["percentage", "flat"];
            if (!validTypes.includes(updates.discount_type)) {
                return res.status(400).json({ message: "Invalid discount type. Use 'percentage' or 'flat'." });
            }
        }

        if (updates.discount_value !== undefined && updates.discount_value <= 0) {
            return res.status(400).json({ message: "Discount value must be greater than zero." });
        }

        let newStartDate = updates.start_date ? new Date(updates.start_date) : existingDiscount.start_date;
        let newEndDate = updates.end_date ? new Date(updates.end_date) : existingDiscount.end_date;

        if (newStartDate >= newEndDate) {
            return res.status(400).json({ message: "End date must be greater than start date." });
        }

        const updatedDiscount = await Discount.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json({ message: "Discount updated successfully", discount: updatedDiscount });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;

        const existingDiscount = await Discount.findById(id);
        if (!existingDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        await Discount.findByIdAndDelete(id);
        res.status(200).json({ message: "Discount deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllDiscount, getDiscountById, getAllActiveDiscount, createDiscount, updateDiscount, deleteDiscount }