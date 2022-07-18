import {makeApp} from "../../src/app";
import {stations} from "../../src/models/stations";
import request from 'supertest'
import '../base'
import {IError} from '../../src/models/errors'

describe("Station", () => {
    const validId = 501
    const invalidId = 9999
    const validUrl = `/stations/${validId}`
    const invalidUrl = `/stations/${invalidId}`

    test("Should be returned when given valid ID", async () => {
        const returnedStation = await request(await makeApp()).get(validUrl);
        expect(returnedStation.statusCode).toBe(200);

        // Check if the returned station is not null and has the correct ID
        const station = returnedStation.body as stations;
        expect(station).toBeTruthy();
        expect(station.id).toEqual(validId)
    })

    test("Should return a '404 not found' error message when is not found", async () => {
        const errorMessage = await request(await makeApp()).get(invalidUrl);
        expect(errorMessage.statusCode).toBe(404);

        // Check if all the fields of the error message match
        const message: IError = errorMessage.body;
        expect(message).toBeTruthy();
        expect(message.status).toEqual(errorMessage.statusCode);
        expect(message.instance).toEqual(invalidUrl);
        expect(message.id).toEqual('Not found');
        expect(message.title).toEqual('Station not found');
        expect(message.detail).toEqual(`The station with ID = ${invalidId} was not found`);
    })

})
