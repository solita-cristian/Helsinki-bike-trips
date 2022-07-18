import {makeApp} from "../../src/app";
import {stations} from "../../src/models/stations";
import request from 'supertest'
import '../base'
import {IError} from "../../src/models/errors";
import {verifyError} from "../base";
import {StationsController} from "../../src/api/controllers/stations";
import {StationsPage} from "../../src/models/page";

interface IStationsParameters {
    page?: number,
    perPage?: number,
    sort?: string
}

const buildQueryParameters = (parameters: IStationsParameters) => {
    const page = parameters.page != undefined ? `page=${parameters.page}` : '';
    const per_page = parameters.perPage != undefined ? `per_page=${parameters.perPage}` : '';
    const sort = parameters.sort != undefined ? `sort=${parameters.sort}` : '';

    const pagination =
        page != '' && per_page != '' ?
            `${page}&${per_page}` :
            page != '' ?
                page :
                per_page != '' ?
                    per_page :
                        '';

    return sort != '' && pagination != '' ?
        `${sort}&${pagination}` :
        sort != '' ?
            sort :
            pagination != '' ?
                pagination :
                '';

}

const makeRequestWithParameters = async (baseUrl: string, parameters: IStationsParameters) => {
    const params = buildQueryParameters(parameters);
    const url = `${baseUrl}?${params}`
    return {
        fullUrl: url,
        response: await request(await makeApp()).get(url)
    };
}

describe("Stations", () => {
    const url = '/stations'
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
                `The parameter page has value ${undefined}. Expected >= 1`,
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
                `The parameter page has value ${undefined}. Expected >= 1`,
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
                `The parameter per_page has value ${parameters.perPage}. ` +
                    `Expected 1 <= per_page <= 457`, //TODO: resolve hardcoded value with database value
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
                `The parameter per_page has value ${undefined}. Expected 1 <= per_page <= 457`,
                fullUrl
            );
        })

    test('Should return a list of stations when both page and per_page query parameters are defined',
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

})
