import {IError} from "../src/models/errors";
import request from "supertest";
import {makeApp} from "../src/app";
import {BaseParameters} from "../src/models/parameters/base";
import {Page, StationsPage} from "../src/models/page";
import {StationParameters} from "../src/models/parameters/station";
import {AppDataSource} from "../src/database";

export abstract class BaseTestInstance {
    protected constructor(protected instanceName: string, protected baseUrl: string) {
    }

    maxPerPage = async () => {
        return await AppDataSource.getRepository(this.instanceName)
            .createQueryBuilder('getCount')
            .cache(true)
            .getCount();
    }

    makeRequestWithParameters = async (requestParameter?: string | number, parameters?: BaseParameters, body?: any, method = 'get') => {
        const params = this.buildQueryParameters(parameters);
        const url = `${this.baseUrl + (requestParameter ? `/${requestParameter}` : '')}?${params}`
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

    verifyBadParameter = (error: IError, badParameterName: string, badParameterValue: any, expectedBadParameterValue: string,
                          instance: string, actualStatusCode: number) => {
        this.verifyError(error,
            'Badly formatted parameter',
            'A required missing parameter is badly formatted',
            actualStatusCode,
            `The parameter ${badParameterName} has value ${badParameterValue}. Expected ${expectedBadParameterValue}`,
            instance
        )
    }

    verifyNotFound = (error: IError, actualStatusCode: number, instance: string, property: string, propertyValue: any) => {
        this.verifyError(error,
            'Not found',
            `${this.instanceName} not found`,
            actualStatusCode,
            `The ${this.instanceName} with ${property} = ${propertyValue} was not found`,
            instance
        )
    }

    verifyPage<T>(stationsPage: Page<T>, page: number, perPage: number) {
        expect(stationsPage).toBeTruthy();
        expect(typeof stationsPage.page).toBe('number')
        expect(stationsPage.page).toEqual(page);
        expect(typeof stationsPage.perPage).toBe('number')
        expect(stationsPage.perPage).toEqual(perPage);
        expect(stationsPage.data).toBeTruthy();
        expect(stationsPage.data).toHaveLength(perPage);
    }

    protected buildQueryParameters = (parameters?: BaseParameters) => {
        let queryParameters = '';
        if (parameters)
            for (const [key, value] of Object.entries(parameters)) {
                if (value != undefined)
                    queryParameters += `${key}=${value}&`;
            }
        return queryParameters;
    }

    private verifyError = (message: IError, id: string, title: string, status: number, detail: string, instance: string) => {
        expect(message).toBeTruthy();
        expect(message.id).toEqual(id);
        expect(message.title).toEqual(title);
        expect(message.status).toEqual(status);
        expect(message.detail).toEqual(detail);
        expect(message.instance).toEqual(instance);
    }

}

export const page = 1
export const perPage = 10

export const testPagination = (testInstance: BaseTestInstance) => {
    test('Should return a 400 bad parameter error when both page and perPage query parameters are missing',
        async () => {
            const parameters: StationParameters = {}
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters);
            expect(response.statusCode).toBe(400);

            testInstance.verifyBadParameter(response.body as IError, 'page', parameters.page, '>= 1',
                fullUrl, response.statusCode)
        })

    test('Should return a 400 bad parameter error when page query parameter is out of bounds',
        async () => {
            const parameters: StationParameters = {
                page: 0
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters);
            expect(response.statusCode).toBe(400);

            testInstance.verifyBadParameter(response.body as IError, 'page', parameters.page, '>= 1',
                fullUrl, response.statusCode)
        })

    test('Should return a 400 bad parameter error when page query parameter is missing',
        async () => {
            const parameters: StationParameters = {
                perPage: perPage
            };
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters);
            expect(response.statusCode).toBe(400);

            testInstance.verifyBadParameter(response.body as IError, 'page', parameters.page, '>= 1',
                fullUrl, response.statusCode)
        })

    test('Should return a 400 bad parameter error when perPage query parameter is out of bounds',
        async () => {
            const parameters: StationParameters = {
                page: page,
                perPage: 0
            };
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters);
            expect(response.statusCode).toBe(400);

            testInstance.verifyBadParameter(response.body as IError, 'perPage', parameters.perPage,
                `1 <= perPage <= ${await testInstance.maxPerPage()}`, fullUrl, response.statusCode)
        })

    test('Should return a 400 bad parameter error when perPage query parameter is missing',
        async () => {
            const parameters: StationParameters = {
                page: page
            };
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters);
            expect(response.statusCode).toBe(400);

            testInstance.verifyBadParameter(response.body as IError, 'perPage', parameters.perPage,
                `1 <= perPage <= ${await testInstance.maxPerPage()}`, fullUrl, response.statusCode)
        })

    test('Should return a list of stations when both page and perPage query parameters are defined',
        async () => {
            const parameters = {
                page: page,
                perPage: perPage
            };
            const {response} = await testInstance.makeRequestWithParameters(undefined, parameters);
            expect(response.statusCode).toBe(200);

            const stations = response.body as StationsPage;
            testInstance.verifyPage(stations, parameters.page, parameters.perPage);

        })
}