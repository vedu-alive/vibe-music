import mongoose from 'mongoose'

export async function connectDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB : ${connection.connection.host}`)
    } catch (error) {
        console.error("Error connecting to mongoDB", error);
        process.exit(1);
    }

}