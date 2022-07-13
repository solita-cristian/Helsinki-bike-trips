import "reflect-metadata";
import {createConnection, DataSource} from "typeorm";
import {stations} from "./models/stations";
import {trips} from "./models/trips";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "solita",
    password: "solita",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [stations, trips],
    subscribers: [],
    migrations: [],
})