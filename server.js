import app from "./app.js"
import {db} from "./db/dbConnection.js"
import Razorpay from "razorpay"
const port = process.env.PORT || 8000
db()

export const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })

app.listen(port,()=>{
    console.log(`app is lisening on port ${port}`)
})