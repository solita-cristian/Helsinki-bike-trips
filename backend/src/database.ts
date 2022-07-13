import "reflect-metadata";
import {createConnection, DataSource} from "typeorm";
import {stations} from "./models/stations";
import {trips} from "./models/trips";
import dotenv from "dotenv";

dotenv.config({
    path: process.cwd() + "/src/.env"
})

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: [stations, trips],
    subscribers: [],
    migrations: [],
})