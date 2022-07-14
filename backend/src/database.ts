import "reflect-metadata";
import {createConnection, DataSource} from "typeorm";
import {stations} from "./models/stations";
import {trips} from "./models/trips";
import dotenv from "dotenv";
import {databaseConfiguration} from "../ormconfig";

export const AppDataSource = new DataSource(databaseConfiguration)