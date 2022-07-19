import dotenv from 'dotenv';
import {AppDataSource} from "./src/database";
import {makeApp} from "./src/app";

dotenv.config()

const port = process.env.PORT;

makeApp()
    .then(app => app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`)
    }))

AppDataSource.initialize()
    .then(async () => {
        console.log('Data source initialised correctly')
    })
    .catch((e) => {
        console.log(`Data source could not be initialised. ${e}`)
    })