import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions'
import 'dotenv/config'

/**
 * Defines the data source configuration
 */
export const databaseConfiguration: PostgresConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/src/models/**/*.{js,ts}'],
    subscribers: [],
    migrations: [],
}