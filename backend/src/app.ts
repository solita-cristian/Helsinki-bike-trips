import express, {Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import {ApplicationLogger} from "./logger";
const SwaggerParser = require('swagger-parser')
import {connector} from 'swagger-routes-express'
const apiControllers = require('./api')
import {setup, serve} from 'swagger-ui-express'
import cors from 'cors';

dotenv.config()

export const makeApp = async () => {
    const parser = new SwaggerParser();
    const apiDefinitions = await parser.validate('./src/api/spec/api_spec.yaml');
    const connect = connector(apiControllers, apiDefinitions);

    const app: Express = express();

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors())

    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        ApplicationLogger.error(`An error has occurred during request ${req.route}: ${err}`)
       return res.status(StatusCodes.BAD_REQUEST).json({
           error: err.message,
       });
    });

    app.use('/api-docs', serve, setup(apiDefinitions))

    connect(app)

    return app;
}
