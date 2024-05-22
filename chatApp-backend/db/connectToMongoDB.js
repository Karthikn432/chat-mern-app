import mongoose from "mongoose";

const connectToMongoDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_CLOUD_STRING);// MONGODB_CONNECTION_STRING
        console.log('Connected to MongoDb')
    } catch (error) {
        console.log("Error connecting to MongoDb", error.message)
    }
}

export default connectToMongoDB;