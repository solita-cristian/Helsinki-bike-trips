import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {databaseConfiguration} from '../ormconfig';

/**
 * The data source object
 */
export const AppDataSource = new DataSource(databaseConfiguration);
