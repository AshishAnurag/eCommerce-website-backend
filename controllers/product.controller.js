const product_model = require("../models/product.model")
const mongoose = require("mongoose")
const category_model = require("../models/category.model")

exports.createProduct = async (req, res) => {
    try {
        const category = await category_model.findById(req.body.category);
        if (!category) return res.status(400).send('Invalid Category')

        const product = await product_model.create(req.body)

        return res.status(201).send(product);
    }
    catch (err) {
        console.log("Error while creating the category", err)
        res.status(500).send({
            message: "Error while creating the categeory"
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
        }
        const product = await product_model.findById(req.params.id);

        const deleted = await product_model.deleteOne(product)
        if (deleted.deletedCount == 1) {
            return res.status(201).send({
                message: "Product deleted Successfully",
                ProductDeleted: product
            })
        }
        else {
            return res.send(500).send({
                message: "Error while deleting"
            })
        }
    }
    catch (err) {
        console.log("Error while deleting the product", err)
        res.status(500).send({
            message: "Error while deleting the product"
        })
    }
}

exports.getProduct = async (req, res) => {
    const product = await product_model.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product);
}

exports.getAllProductofCAT = async (req, res) => {
    const product = await product_model.find(req.body.category).populate('category');

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product);
}


exports.getAllProduct = async (req, res) => {
    const product = await product_model.find();

    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product);
}

exports.count = async (req, res) => {
    const productCount = await product_model.countDocuments((count) => count)

    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        productCount: productCount
    });
}



exports.updateProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }
    const product = await product_model.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews
        },
        { new: true }
    )

    if (!product)
        return res.status(500).send('the product cannot be updated!')

    res.send(product);
}





exports.getProductFilter = async (req, res) => {
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') }
    }

    const productList = await product_model.find(filter).populate('category');

    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList);
}