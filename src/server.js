//import packages from node_modules
import Express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import DotEnv from 'dotenv';
import Mongoose from 'mongoose';



import { errorHandlerMiddleware } from "./api/helpers/CustomError.js";
import { customErrorMiddleware } from "./api/middlewares/customErrorMiddleware.js";
import Routes from "./api/routes/index.js";
import mongo from "./api/modules/mongodb.js";

//configure dotenv 
DotEnv.config();

const app = Express();

//import PORT from .env
const PORT = process.env.PORT || 6690;

//setup server function 

async function server() {
    try {
        //connect to mongodb
        const db = await mongo();
        // Mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });
        // console.log('Mongodb ga ulanish hosil qilindi');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        }
        );

        app.use(Express.json());
        app.use(Express.urlencoded({ extended: true }));


        //setup security 
        app.use(helmet());
        app.use(morgan('dev'));


        //use db as a request property
        app.use((req, res, next) => {
            req.db = db
            next();
        });
        // console.log(Mongoose.connection.db);

        //use custom error handler
        app.use(customErrorMiddleware);

        await Routes(app);

        //use route error handler
        app.use(errorHandlerMiddleware);

        app.get('/', (req, res) => {
            res.json({
                message: 'Server is running'
            });
        });


    }
    catch (err) {
        console.log("SERVER_ERROR ", err)
    }
}

//run server
server().then();







