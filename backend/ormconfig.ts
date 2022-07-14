import {stations} from "./src/models/stations";
import {trips} from "./src/models/trips";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import dotenv from "dotenv";

dotenv.config()

export const databaseConfiguration: PostgresConnectionOptions = {
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
}