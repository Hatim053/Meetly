import mongoose from "mongoose"


async function connectDb(url) {
    try {
       const dbInstance =  await mongoose.connect(url)
        console.log("Connected to MongoDB")
        return dbInstance
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
    }
}


export default connectDb