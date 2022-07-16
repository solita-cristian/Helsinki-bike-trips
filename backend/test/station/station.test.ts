import {makeApp} from "../../src/app";
import {stations} from "../../src/models/stations";
import request from 'supertest'
import '../base'
import {IError} from '../../src/models/errors'

describe("Station", () => {
    const validUrl = '/stations/501'
    const invalidUrl = '/stations/9999'

    test("Should be returned when given valid ID", async () => {
        const returnedStation = await request(await makeApp()).get(validUrl)
        expect(returnedStation.statusCode).toBe(200)
        expect(returnedStation.body).toBeTruthy()
    })

    test("Should return an error message when station is not found", async () => {
        const errorMessage = await request(await makeApp()).get(invalidUrl)
        expect(errorMessage.statusCode).toBe(404)
        const message: IError = errorMessage.body
        expect(message).toBeTruthy()
        expect(message.status).toEqual(errorMessage.statusCode)
        expect(message.instance).toEqual(invalidUrl)
    })

})
