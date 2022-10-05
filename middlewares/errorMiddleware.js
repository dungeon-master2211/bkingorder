export const errorMiddleware = async(err,req,res,next)=>{
    const message = err.message || "Internal Server Error"
    const statusCode = err.statusCode || 500

    return res.status(statusCode).send({
        success:false,
        message:message
    })
}

export const catchAsyncError = (func)=>(req,res,next)=>{
    Promise.resolve(func(req,res,next)).catch(next)
}

