import {Sequelize} from "sequelize";
import DotEnv from 'dotenv';
import UsersModel from "../../models/UsersModel.js";
import UserSessionsModel from "../../models/UserSessionsModel.js";
import Relations from "../../models/Relations.js";
import UserBanModel from "../../models/UserBanModel.js";
import AttemptsModel from "../../models/AttemptsModel.js";

DotEnv.config()

// assign postgres url from env file
const DB_URL = process.env.PG_CONNECTION_URL

if (!DB_URL)
    throw new Error("PG CONNECTION STRING IS NOT FOUND!")

// connect postgres with sequelize orm
const sequelize = new Sequelize(DB_URL, {
    logging: false
})

export default async function pg() {
    try {
        await sequelize.authenticate();

        // create database object
        let db = {}
        db.users = await UsersModel(sequelize, Sequelize)
        db.user_sessions = await UserSessionsModel(sequelize, Sequelize)
        db.user_bans = await UserBanModel(sequelize, Sequelize)
        db.user_attempts = await AttemptsModel(sequelize, Sequelize)

        await Relations(db)

        // connect
        await sequelize.sync({ force: false })

        return db;
    } catch (e) {
        console.log("SQL_ERROR:", e)
    }
}