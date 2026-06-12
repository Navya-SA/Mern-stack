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
        const {
            page = 1,
            limit = 12,
            search,
            bestSeller,
            sort,
            category
        } = req.query;

        const query = {};

        if (search && search.trim()) {
            query.title = { $regex: search.trim(), $options: "i" };
        }

        if (bestSeller === "true") {
            query.isBestSeller = true;
        }

        if (category) {
            query.category_id = category;
        }

        const sortMap = {
            price_asc:  { price: 1 },
            price_desc: { price: -1 },
            stars:      { stars: -1 },
        };
        const sortObj = sortMap[sort] || {};

        const pageNum  = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // cap at 50
        const skip     = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
            Product.find(query).sort(sortObj).skip(skip).limit(limitNum).lean(),
            Product.countDocuments(query),
        ]);

        res.status(200).json({
            message: "Products fetched successfully",
            products,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
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
        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            product
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