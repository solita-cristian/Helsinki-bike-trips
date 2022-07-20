import {IError} from "../src/models/errors";
import request from "supertest";
import {makeApp} from "../src/app";
import {BaseParameters} from "../src/models/parameters/base";
import {Page, StationsPage} from "../src/models/page";
import {StationParameters} from "../src/models/parameters/station";
import {AppDataSource} from "../src/database";

/**
 * Defines a base test instance, which abstracts the request call, the url buildup and some repetitive checks
 */
export abstract class BaseTestInstance {
    protected constructor(protected instanceName: string, protected baseUrl: string) {
    }

    /**
     * Gets the maximum amount of items a page can contain
     */
    maxPerPage = async () => {
        return await AppDataSource.getRepository(this.instanceName)
            .createQueryBuilder('getCount')
            .cache(true)
            .getCount();
    }

    /**
     * Makes an HTTP request
     * @param requestParameter A request parameter or partial url
     * @param parameters a structure containing the query parameters of the request
     * @param body The body of the request
     * @param method The method of the request
     */
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

    /**
     * Makes assertions of a bad parameter error response
     * @param error The error instance
     * @param badParameterName The name of the bad parameter
     * @param badParameterValue The actual value of the bad parameter
     * @param expectedBadParameterValue The expected value of the bad parameter
     * @param instance The URL of the request
     * @param actualStatusCode The status code of the response
     */
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

    /**
     * Makes assertions of a bad parameter error response
     * @param error The error instance
     * @param actualStatusCode The status code of the response
     * @param instance The URL of the request
     * @param parameterName The name of the parameter which lead to the failure of the request
     * @param parameterValue The value of the parameter
     */
    verifyNotFound = (error: IError, actualStatusCode: number, instance: string, parameterName: string, parameterValue: any) => {
        this.verifyError(error,
            'Not found',
            `${this.instanceName} not found`,
            actualStatusCode,
            `The ${this.instanceName} with ${parameterName} = ${parameterValue} was not found`,
            instance
        )
    }

    /**
     * Makes assertions on a page
     * @param stationsPage The page object
     * @param page The expected page number
     * @param perPage The expected number of items per page
     */
    verifyPage<T>(stationsPage: Page<T>, page: number, perPage: number) {
        expect(stationsPage).toBeTruthy();
        expect(typeof stationsPage.page).toBe('number')
        expect(stationsPage.page).toEqual(page);
        expect(typeof stationsPage.perPage).toBe('number')
        expect(stationsPage.perPage).toEqual(perPage);
        expect(stationsPage.data).toBeTruthy();
        expect(stationsPage.data).toHaveLength(perPage);
    }

    /**
     * Builds the query string, based on a parameters object
     * @param parameters The parameters object
     */
    protected buildQueryParameters = (parameters?: BaseParameters) => {
        let queryParameters = '';
        if (parameters)
            for (const [key, value] of Object.entries(parameters)) {
                if (value != undefined)
                    queryParameters += `${key}=${value}&`;
            }
        return queryParameters;
    }

    /**
     * Makes assertions about a generic error
     * @param message The error message
     * @param id The expected id
     * @param title The expected title
     * @param status The expected status code
     * @param detail The expected detailed message
     * @param instance The URL of the failed request
     */
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

/**
 * Defines a series of standardised tests for a paginated model
 * @param testInstance The test instance
 */
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