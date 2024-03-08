const {Order} = require('../models/order.model');
const express = require('express');
const mongoose = require('mongoose');
const {OrderItem} = require('../models/order_item.model');

exports.getOrder = async (req,res) => {
    const orderList = await Order.find().populate('user', 'name');

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.status(201).send(orderList);
}

exports.getOrderbyId = async (req,res) => {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        });

    if(!order) {
        res.status(500).json({success: false})
    } 
    res.status(201).send(order);
}

exports.addOrder = async (req,res) => {
    try{
        const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            })
    
            newOrderItem = await newOrderItem.save();
    
            return newOrderItem._id;
        }))
        const orderItemsIdsResolved =  await orderItemsIds;
    
        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice
        }))
    
        const totalPrice = totalPrices.reduce((a,b) => a +b , 0);
    
        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        })
        order = await order.save();
    
        if(!order)
        return res.status(400).send('the order cannot be created!')
    
        res.send(order);
    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            message : "Error placing Order"
        })
    }
}

exports.updateOrder = async (req,res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

    res.send(order);
}

exports.deleteOrder = async (req,res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Order Id')
        }
        const order = await Order.findById(req.params.id);
        // const orderItemdeleted = await OrderItem.deleteOne(req.body.orderItems.map());
        const deleted = await Order.deleteOne(order);
        if (deleted.deletedCount == 1) {
            return res.status(201).send({
                message: "Order deleted Successfully",
                orderDeleted: order
            })
        }
        else {
            return res.send(500).send({
                message: "Error while deleting"
            })
        }
    }
    catch (err) {
        console.log("Error while deleting the order", err)
        res.status(500).send({
            message: "Error while deleting the order"
        })
    }
}

exports.totalSales =async (req,res) => {
    const totalSales= await Order.aggregate([
        { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
    ])

    if(!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
}

exports.count = async (req,res) => {
    const orderCount = await Order.countDocuments((count) => count)

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
}

exports.userOrder = async (req,res) => {
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
}