import "reflect-metadata";
import {createConnection, DataSource} from "typeorm";
import {Station} from "./models/station";
import {Trip} from "./models/trip";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [Station, Trip],
    subscribers: [],
    migrations: [],
})