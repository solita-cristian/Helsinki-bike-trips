import "reflect-metadata";
import {DataSource} from "typeorm";
import {databaseConfiguration} from "../ormconfig";

export const AppDataSource = new DataSource(databaseConfiguration)