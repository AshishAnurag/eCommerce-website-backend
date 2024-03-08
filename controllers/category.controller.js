const category_model = require("../models/category.model")
const express = require('express');
exports.createCategory = async (req, res) => {
    try {
        const category = await category_model.create(req.body)

        return res.status(201).send(category);
    }
    catch (err) {
        console.log("Error while creating the category", err)
        res.status(500).send({
            message: "Error while creating the categeory"
        })
    }
}


exports.deleteCategory = async (req, res) => {
    try {
        const category = await category_model.findById(req.params.id);
        if(!category) {
            res.status(500).json({message: 'The category with the given ID was not found.'})
        }
        const deleted = await category_model.deleteOne(category)
        if(deleted.deletedCount == 1){
            return res.status(201).send({
                message:"Category deleted Successfully",
                categoryDeleted : category
            })
        }
        else{
            return res.send(500).send({
                message: "Error while deleting"
            })
        }
    }
    catch (err) {
        console.log("Error while deleting the category", err)
        res.status(500).send({
            message: "Error while deleting the categeory"
        })
    }
}

exports.updateCategory = async (req, res) => {
    try {   
        const category = await category_model.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description : req.body.description
            },
            { new: true}
        )
        if(!category)
        return res.status(400).send('Category cannot be updated!')
    
        res.send(category);
    }
    catch (err) {
        console.log("Error while updating the category", err)
        res.status(500).send({
            message: "Error while updating the categeory"
        })
    }
    
}

exports.getCategory = async (req, res) => {
    try {
        const category = await category_model.findById(req.params.id);
        if(!category) {
            res.status(500).json({message: 'The category with the given ID was not found.'})
        } 
        
        return res.status(201).send(category)
    }
    catch (err) {
        console.log("Category Not Found", err)
        res.status(500).send({
            message: "Category Not Found"
        })
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        const category = await category_model.find()
        return res.status(201).send(category)
    }
    catch (err) {
        console.log("Category Not Found", err)
        res.status(500).send({
            message: "Category Not Found"
        })
    }
}