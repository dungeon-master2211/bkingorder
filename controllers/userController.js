import { catchAsyncError } from "../middlewares/errorMiddleware.js"
import { User } from "../models/User.js"
import {Order} from "../models/Order.js"
import { Message } from "../models/Message.js"
export const myProfile = async(req,res,next)=>{
        res.status(200).send({
            success:true,
            user:req.user
        })
}

export const logout = async(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err) return next(err)

        res.clearCookie("connect.sid",{
            secure:process.env.NODE_ENV==="development" ?false:true,
            httpOnly:process.env.NODE_ENV==="development"?false:true,
            sameSite:process.env.NODE_ENV==="development" ?false:"none",
        })
        res.status(200).send({
            message:"logged out"
        })
    })
}

export const getAdminUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find({})
    return res.status(200).json({
        "success":true,
        users
    })    
})

export const getAdminStats = catchAsyncError(async(req,res,next)=>{
    const usersCount = await User.countDocuments()

    const orders = await Order.find({})

    const prepairing = orders.filter(i=>i.orderStatus==='Preparing')
    const shipped = orders.filter(i=>i.orderStatus==='Shipped')
    const delivered = orders.filter(i=>i.orderStatus==='Delivered')

    let totalIncome = 0
    orders.forEach(item=>{
        totalIncome+=item.totalAmount
    })

    res.status(200).json({
        success:true,
        usersCount,
        ordersCount:{
            totalOrders : orders.length,
            prepairing,
            shipped,
            delivered
        },
        totalIncome 
    })
})

export const sendMessage = catchAsyncError(async(req,res,next)=>{
    const {name,email,message} = req.body
    const send = await Message.create({name,email,message})
    await send.save()
    return res.status(200).send({
        success:true,
        message:"Successfully sent"
    })
})