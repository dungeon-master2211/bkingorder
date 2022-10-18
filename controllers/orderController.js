import { catchAsyncError } from "../middlewares/errorMiddleware.js"
import { Order } from "../models/Order.js"
import { User } from "../models/User.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import {instance} from "../server.js"
import crypto from "crypto"
import { Payment } from "../models/Payment.js"
export const placeOrder = catchAsyncError(async(req,res,next)=>{
    const {
        shippingInfo,orderItems,paymentMethod,itemsPrice,taxPrice,shippingCharges,totalAmount
    } = req.body

    const user = req.user._id

    const orderOptions = {

        shippingInfo,orderItems,paymentMethod,itemsPrice,taxPrice,shippingCharges,totalAmount,user

    }
    await Order.create(orderOptions)

    res.status(201).send({
        success:true,
        message:"Order Placed Successfully via COD"
    })
})

export const placeOrderOnline = catchAsyncError(async(req,res,next)=>{
    const {
        shippingInfo,orderItems,paymentMethod,itemsPrice,taxPrice,shippingCharges,totalAmount
    } = req.body    

    const user = req.user._id

    const orderOptions = {

        shippingInfo,orderItems,paymentMethod,itemsPrice,taxPrice,shippingCharges,totalAmount,user

    }
    const options = {
        amount: Number(totalAmount)*100,  // amount in the smallest currency unit
        currency: "INR",
      };

    const order = await instance.orders.create(options)
    

    res.status(201).send({
        success:true,
        order,
        orderOptions
    })
})

export const paymentVerification = catchAsyncError(async(req,res,next)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature,orderOptions}=req.body

    const body =razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature= crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex")

    const isAuthentic = expectedSignature===razorpay_signature

    if(isAuthentic){
        const payment = await Payment.create({
            razorpay_order_id,razorpay_payment_id,razorpay_signature
        })

        await Order.create({
            ...orderOptions,
            paymentInfo :payment._id,
            paidAt:new Date(Date.now())

        })

        res.status(201).json({
            success:true,
            message:`Order Placed Successfully Reference Id:${payment._id}`,

        })
    }else{
        return next(new ErrorHandler("Payment Failed",400))
    }

})

export const myOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await User.find({
        user:req.user._id
    }).populate('user','name').exec()

    res.status(200).send({
        success:true,
        orders
    })
})

export const getOrderDetails = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','name').exec()

    if(!order) return next(new ErrorHandler("Invalid order id",404))

    res.status(200).send({
        success:true,
        order
    })
})

export const getAdminOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({}).populate('user','name')
    res.status(200).send({
        success:true,
        orders
    })
})

export const processOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order) return next(new ErrorHandler("Invalid Order Id",404))

    if(order.orderStatus === 'Preparing'){
        order.orderStatus = "Shipped"
    }else if(order.orderStatus === 'Shipped'){
        order.orderStatus = "Delivered"
        order.deliveredAt = new Date(Date.now())
    }else if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler("Food Already Delivered",400))
    }

    await order.save()
    res.status(200).send({
        success:true,
        message:'Status updated successfully'
    })
})