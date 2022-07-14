import {AppDataSource} from "../database";
import {beforeAll, afterEach} from "@jest/globals";
import {TestLogger} from "../logger";

// setting a timeout of 20 seconds ensures that the database connection is established.
jest.setTimeout(20 * 1000)

// Initialise the database connection before doing any tests
beforeAll(() => {
    AppDataSource.initialize()
        .then(async () => {
            TestLogger.debug("Database connection established")
        })
})

// Destroy the database connection after all tests are finished
afterAll(() => {
    AppDataSource.destroy()
        .then(_ => TestLogger.debug("Database connection closed"))
})