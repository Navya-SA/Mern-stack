const Product = require('../model/productSchema');

const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            product: savedProduct
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to create product",
            error: err.message
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            message: "Products fetched successfully",
            products: products
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: err.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            product: product
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: err.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update product",
            error: err.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete product",
            error: err.message
        });
    }
};


module.exports = {
    createProduct,
    getProduct,
    getProductById,
    updateProduct,
    deleteProduct
};