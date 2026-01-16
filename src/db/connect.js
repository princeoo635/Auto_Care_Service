import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
        const connectionInstance=  await mongoose.connect(`${process.env.MONGODB_URL_LOCAL}/Auto_Care_Service`)
        console.log(`MongoDB connected !! DB Host : ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error("MongoDB connection Error :", error);
        process.exit(1)
    }
}

export default connectDB;