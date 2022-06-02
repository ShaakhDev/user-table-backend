import Mongoose from "mongoose";
import DotEnv from "dotenv";
import UsersModel from "../models/UsersModel.js";


DotEnv.config();


const DB_URI = process.env.MONGODB_URI;

if (!DB_URI) {
    throw new Error("MongoDB URI not found");
}

export default async function mongo() {
    try {
        await Mongoose.connect(DB_URI, { useUnifiedTopology: true });
        console.log("Mongodb ga ulanish hosil qilindi");


        //create database object

        let db = {}
        db.users = await UsersModel(Mongoose)

        return db;
    } catch (error) {
        console.log(error);
    }
}
