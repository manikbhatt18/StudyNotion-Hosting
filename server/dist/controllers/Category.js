"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryPageDetails = exports.showAllCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }
        const CategorysDetails = await Category_1.default.create({
            name: name,
            description: description,
        });
        console.log(CategorysDetails);
        return res.status(200).json({
            success: true,
            message: "Categorys Created Successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message,
        });
    }
};
exports.createCategory = createCategory;
const showAllCategories = async (req, res) => {
    try {
        const allCategorys = await Category_1.default.find();
        return res.status(200).json({
            success: true,
            data: allCategorys,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.showAllCategories = showAllCategories;
const categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;
        // Get courses for the specified category
        const selectedCategory = await Category_1.default.findById(categoryId)
            .populate({
            path: "courses",
            match: { status: "Published" },
            populate: "ratingAndReviews",
        })
            .exec();
        console.log("SELECTED COURSE", selectedCategory);
        // Handle the case when the category is not found
        if (!selectedCategory) {
            console.log("Category not found.");
            return res
                .status(404)
                .json({ success: false, message: "Category not found" });
        }
        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            console.log("No courses found for the selected category.");
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            });
        }
        // Get courses for other categories
        const categoriesExceptSelected = await Category_1.default.find({
            _id: { $ne: categoryId },
        });
        let differentCategory = null;
        if (categoriesExceptSelected.length > 0) {
            differentCategory = await Category_1.default.findOne(categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id)
                .populate({
                path: "courses",
                match: { status: "Published" },
            })
                .exec();
        }
        // Get top-selling courses across all categories
        const allCategories = await Category_1.default.find()
            .populate({
            path: "courses",
            match: { status: "Published" },
        })
            .exec();
        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10);
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.categoryPageDetails = categoryPageDetails;
