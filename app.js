import express, { urlencoded } from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import router from "./routes/user.js"
import orderRoute from "./routes/orderRoute.js"

import {connectPassport} from "./utils/Provider.js"
import session from "express-session"
import passport from "passport"
import { errorMiddleware } from "./middlewares/errorMiddleware.js"




const app = express()


dotenv.config({path:"./config/config.env"})


// middlewares
app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({
    extended:true
}))

app.use(cors({
    credentials :true,
    origin:process.env.FRONTEND_URL,
    methods:["GET","PUT","POST","DELETE"]
}))

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:process.env.NODE_ENV==="development" ?false:true,
        httpOnly:process.env.NODE_ENV==="development"?false:true,
        sameSite:process.env.NODE_ENV==="development" ?false:"none",
    }
}))

app.use(passport.authenticate("session"))
app.use(passport.initialize())
app.use(passport.session())
app.enable("trust proxy")
connectPassport()
app.get('/',function(req,res,next){
    res.status(200).send(
        `<h1>Welcome </h1>`
    )
})
app.use('/api/v1',router)
app.use('/api/v1',orderRoute)

app.use(errorMiddleware)
export default app
