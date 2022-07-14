import {makeApp} from "../../src/app";
import {stations} from "../../src/models/stations";
import request from 'supertest'
import '../base'

describe("Stations", () => {

    test("Should be returned the from database", async () => {
        const returnedStations = await request(await makeApp()).get('/stations')
        expect(returnedStations.statusCode).toBe(200)
        expect(returnedStations.body).toBeTruthy()
    })

})
