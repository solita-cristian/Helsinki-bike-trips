import {makeApp} from "../../server";
import {stations} from "../../models/stations";
import request from 'supertest'
import '../index'

describe("Stations", () => {

    test("Should be returned the from database", async () => {
        const returnedStations = await request(await makeApp()).get('/stations')
        expect(returnedStations.statusCode).toBe(200)
        expect(returnedStations.body).toBeTruthy()
    })

})
