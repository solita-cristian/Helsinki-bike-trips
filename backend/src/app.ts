import express, {Express} from 'express';
import dotenv from 'dotenv';
import {connector} from 'swagger-routes-express'
import {serve, setup} from 'swagger-ui-express'
import cors from 'cors';

const SwaggerParser = require('swagger-parser')
const apiControllers = require('./api')

dotenv.config()

export const makeApp = async () => {
    const parser = new SwaggerParser();
    const apiDefinitions = await parser.validate('./src/api/spec/api_spec.yaml');
    const connect = connector(apiControllers, apiDefinitions);

    const app: Express = express();

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cors())

    app.use('/api-docs', serve, setup(apiDefinitions))

    connect(app)

    return app;
}
