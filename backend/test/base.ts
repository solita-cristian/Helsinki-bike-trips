import {AppDataSource} from "../src/database";
import {beforeAll} from "@jest/globals";
import {IError} from "../src/models/errors";

// setting a timeout of 20 seconds ensures that the database connection is established.
jest.setTimeout(20 * 1000)

// Initialise the database connection before doing any tests
beforeAll(() => {
    AppDataSource.initialize()
        .then(async () => {
            console.log("Database connection established")
        })
})

// Destroy the database connection after all tests are finished
afterAll(() => {
    AppDataSource.destroy()
        .then(_ => console.log("Database connection closed"))
})

export const verifyError = (message: IError, id: string, title: string, status: number, detail: string, instance: string) => {
    expect(message).toBeTruthy();
    expect(message.id).toEqual(id);
    expect(message.title).toEqual(title);
    expect(message.status).toEqual(status);
    expect(message.detail).toEqual(detail);
    expect(message.instance).toEqual(instance);
}