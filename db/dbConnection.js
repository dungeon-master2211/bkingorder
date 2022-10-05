import mongoose from "mongoose";
const DB_URI = process.env.DB

export const db=async()=>{
    try{
        await mongoose.connect(DB_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log('db connected')
    }catch(err){
        console.log(err)
    }
}
