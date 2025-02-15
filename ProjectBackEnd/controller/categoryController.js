const Category = require("../model/Category");

const getAllCategory = async (req, res) => {
    try{
        const categories = await Category.find();
        res.status(200).json(categories);
    }catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getCategoryById = async (req, res) => {
    try{
        const category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ message: "Category not found" });
        res.json(category);
    }catch(error){
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const createCategory = async (req, res) => {
    try {
        const newCategory = await Category.findOne({category_name : req.body.category_name});
        
        if(newCategory) return res.status(400).json({ message: "Category already exists" });

        await Category.create(req.body);
        res.json({ message: "New Category created successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Category updated successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await Category.findByIdAndDelete(categoryId);
        res.json({ message: "Category deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { getAllCategory, getCategoryById, updateCategory, deleteCategory, createCategory};