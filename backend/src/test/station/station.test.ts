import {makeApp} from "../../server";
import {stations} from "../../models/stations";
import request from 'supertest'
import '../index'
import {Error} from '../../models/errors'

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
        const message: Error = errorMessage.body
        expect(message).toBeTruthy()
        expect(message.status).toEqual(errorMessage.statusCode)
        expect(message.instance).toEqual(invalidUrl)
    })

})
