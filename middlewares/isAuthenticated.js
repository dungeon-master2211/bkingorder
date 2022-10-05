import ErrorHandler from "../utils/ErrorHandler.js"

export const isAuthenticated = async(req,res,next)=>{
    const token = req.cookies["connect.sid"]
    // console.log(token)
    if(!token){
        return next(new ErrorHandler("Authentication Error, Please Login to Continue",400))
    }
    next()
}

export const authorizeAdmin = async(req,res,next)=>{
    if (req.user.role!=='admin'){
        return next(new ErrorHandler("Only Admin Allowed",405))
    }
    next()
}