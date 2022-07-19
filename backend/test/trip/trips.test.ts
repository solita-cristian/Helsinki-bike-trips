import {makeApp} from "../../src/app";
import request from 'supertest'
import '../base'
import {IError} from "../../src/models/errors";
import {verifyError} from "../base";
import {StationsPage, TripsPage} from "../../src/models/page";
import {TripParameters} from "../../src/models/parameters/trip";

const buildQueryParameters = (parameters: TripParameters) => {
    let queryParameters = '';
    for (const [key, value] of Object.entries(parameters)) {
        if (value != undefined)
            queryParameters += `${key}=${value}&`;
    }
    return queryParameters;
}

const makeRequestWithParameters = async (baseUrl: string, parameters: TripParameters, body?: any, method = 'get') => {
    const params = buildQueryParameters(parameters);
    const url = `${baseUrl}?${params}`
    let response;

    switch (method) {
        case 'post':
            response = await request(await makeApp()).post(url).send(body)
            break;
        default:
            response = await request(await makeApp()).get(url)
            break;
    }

    return {
        fullUrl: url,
        response: response
    };
}

describe("Trips", () => {
    const url = '/trips'
    const page = 1
    const per_page = 10

    test('Should return a 400 bad parameter error when both page and per_page query parameters are missing',
        async () => {
            const response = await request(await makeApp()).get(url);
            expect(response.statusCode).toEqual(400);

            verifyError(response.body as IError,
                'Badly formatted parameter',
                'A required missing parameter is badly formatted',
                response.statusCode,
                `The parameter page has value ${NaN}. Expected >= 1`,
                url
            );
        })

    test('Should return a 400 bad parameter error when page query parameter is out of bounds',
        async () => {
            const parameters = {
                page: 0
            }
            const {fullUrl, response} = await makeRequestWithParameters(url, parameters)
            expect(response.statusCode).toEqual(400);

            verifyError(response.body as IError,
                'Badly formatted parameter',
                'A required missing parameter is badly formatted',
                response.statusCode,
                `The parameter page has value ${parameters.page}. Expected >= 1`,
                fullUrl
            );
        })

    test('Should return a 400 bad parameter error when page query parameter is missing',
        async () => {
            const parameters = {
                perPage: 10
            };
            const {fullUrl, response} = await makeRequestWithParameters(url, parameters)
            expect(response.statusCode).toEqual(400);

            verifyError(response.body as IError,
                'Badly formatted parameter',
                'A required missing parameter is badly formatted',
                response.statusCode,
                `The parameter page has value ${NaN}. Expected >= 1`,
                fullUrl
            );
        })

    test('Should return a 400 bad parameter error when per_page query parameter is out of bounds',
        async () => {
            const parameters = {
                page: 1,
                perPage: 0
            };
            const {fullUrl, response} = await makeRequestWithParameters(url, parameters)
            expect(response.statusCode).toEqual(400);

            verifyError(response.body as IError,
                'Badly formatted parameter',
                'A required missing parameter is badly formatted',
                response.statusCode,
                `The parameter perPage has value ${parameters.perPage}. ` +
                `Expected 1 <= perPage <= 3126266`, //TODO: resolve hardcoded value with database value
                fullUrl
            );
        })

    test('Should return a 400 bad parameter error when per_page query parameter is missing',
        async () => {
            const parameters = {
                page: 12
            };
            const {fullUrl, response} = await makeRequestWithParameters(url, parameters)
            expect(response.statusCode).toEqual(400);

            verifyError(response.body as IError,
                'Badly formatted parameter',
                'A required missing parameter is badly formatted',
                response.statusCode,
                `The parameter perPage has value ${NaN}. Expected 1 <= perPage <= 3126266`,
                fullUrl
            );
        })

    test('Should return a list of trips when both page and per_page query parameters are defined',
        async () => {
            const parameters = {
                page: page,
                perPage: per_page
            };
            const {response} = await makeRequestWithParameters(url, parameters);
            expect(response.statusCode).toEqual(200);

            const stations = response.body as StationsPage;
            expect(stations).toBeTruthy();
            expect(stations.page).toEqual(page);
            expect(stations.perPage).toEqual(per_page);
            expect(stations.data).toBeTruthy();
            expect(stations.data).toHaveLength(per_page);

        })

    test('Should return a list of trips satisfying distance parameter', async () => {
        const parameters: TripParameters = {
            distance: 4.604,
            page: page,
            perPage: per_page
        }

        const {response} = await makeRequestWithParameters(url, parameters);
        expect(response.statusCode).toEqual(200);

        const stations: TripsPage = response.body;
        expect(stations.data.length).toBeGreaterThan(0);
        stations.data.forEach(s => expect(s.distance).toEqual(4604));

    })

    test('Should return a list of station satisfying duration parameter', async () => {
        const parameters: TripParameters = {
            duration: 18.9,
            page: page,
            perPage: per_page
        }

        const {response} = await makeRequestWithParameters(url, parameters);
        expect(response.statusCode).toEqual(200);

        const stations: TripsPage = response.body;
        expect(stations.data.length).toBeGreaterThan(0);
        stations.data.forEach(s => expect(s.duration).toEqual(18.9 * 60))

    })

    test('Should return a list of station satisfying departure parameter', async () => {
        const parameters: TripParameters = {
            departure: 501,
            page: page,
            perPage: per_page
        }
        const {response} = await makeRequestWithParameters(url, parameters);
        expect(response.statusCode).toEqual(200);

        const stations: TripsPage = response.body;
        expect(stations.data.length).toBeGreaterThan(0);
        stations.data.forEach(s => expect(s.departure_station.id).toEqual(501))

    })

    test('Should return a list of station satisfying return parameter', async () => {
        const parameters: TripParameters = {
            return: 501,
            page: page,
            perPage: per_page
        }
        const {response} = await makeRequestWithParameters(url, parameters);
        expect(response.statusCode).toEqual(200);

        const stations: TripsPage = response.body;
        expect(stations.data.length).toBeGreaterThan(0);
        stations.data.forEach(s => expect(s.return_station.id).toEqual(501))

    })

})
