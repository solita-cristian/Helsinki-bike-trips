import express, {Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import logging from "logging";

let logger = logging('Application')
dotenv.config()

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   logger.error(err.message, err);
   return res.status(StatusCodes.BAD_REQUEST).json({
       error: err.message,
   });
});

export default app;