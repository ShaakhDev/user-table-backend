// import packages from node_modules
import Express from 'express';
import helmet from "helmet";
import morgan from 'morgan';
import DotEnv from 'dotenv';

// import files from src
import { errorHandlerMiddleware } from "./api/helpers/CustomError.js";
import { customErrorMiddleware } from "./api/middlewares/customErrorMiddleware.js";
import Routes from "./api/routes/index.js";
import pg from './api/modules/pg/pg.js';

// configure .env file
DotEnv.config()

const app = Express();
// import PORT number from .env
const PORT = process.env.PORT || 6690

// setup server function
async function server() {
    try {
        // setup postgres database
        const db = await pg();

        app.listen(PORT, () =>
            console.log(`🚀 SERVER READY @ http://localhost:${process.env.PORT || 6690}`)
        );

        app.use(Express.json());
        app.use(Express.urlencoded({extended: true}));

        // setup security packages
        app.use(morgan('dev'))
        app.use(helmet())

        // use db as a request
        app.use((req, res, next) => {
            req.db = db;
            next();
        });

        // use custom error handlers
        app.use(customErrorMiddleware);

        // set main path to routes
        await Routes(app)

        // use route error handler
        app.use(errorHandlerMiddleware);


        app.get('/', (req, res) => {
            res.json({
                "Project name": "User Registration",
                "version": "1.0.0^development",
                "author": "github.com/mabrur-h"
            })
        })
    } catch (error) {
        // if something wrong in the server it logs an error
        console.log("SERVER_ERROR:", error);
    }
}

// run server
server().then();
