import '../base'
import {IError} from '../../src/models/errors'
import {BaseTestInstance, page, perPage, testPagination} from '../base'
import {StationsPage} from '../../src/models/page'
import {AddressLanguage, NameLanguage, StationParameters} from '../../src/models/parameters/station'
import {AppDataSource} from '../../src/database'

/**
 * Defines a test instance specifically for testing stations
 */
class StationsTestInstance extends BaseTestInstance {
    /**
     * Constructs a new test instance
     */
    constructor() {
        super('stations', '/stations')
    }

    /**
     * Builds a specific query string, based on the parameters the /stations route accepts
     * @param parameters The parameters object
     */
    buildQueryParameters = (parameters?: StationParameters) => {
        let queryParameters = ''
        if (parameters)
            for (const [key, value] of Object.entries(parameters)) {
                if (value != undefined)
                    if (['city', 'name', 'address'].includes(key))
                        queryParameters += `${key}=${value[0]}&${key}=${value[1]}&`
                    else
                        queryParameters += `${key}=${value}&`
            }
        return queryParameters
    }


}

const testInstance = new StationsTestInstance()

beforeAll(async () => {
    await AppDataSource.initialize()
})

afterAll(async () => {
    await AppDataSource.destroy()
})

describe('Stations', () => {

    testPagination(testInstance)

    test('Should return a list of station satisfying city parameter', async () => {
        const parameters: StationParameters = {
            city: ['Espoo', AddressLanguage.FI],
            page: page,
            perPage: perPage
        }

        const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
        expect(response.statusCode).toEqual(200)

        const stations: StationsPage = response.body
        expect(stations.data.length).toBeGreaterThan(0)
        stations.data.forEach(s => expect(s.city_fi).toEqual('Espoo'))

    })

    test('Should return a 400 bad parameter error when city query parameter has invalid language',
        async () => {
            const parameters: StationParameters = {
                city: ['Espoo', 'en' as AddressLanguage],
                page: page,
                perPage: perPage
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toBe(400)

            testInstance.verifyBadParameter(response.body as IError, 'city', parameters.city,
                'language in [fi, se]', fullUrl, response.statusCode)
        })

    test('Should return a list of station satisfying address parameter', async () => {
        const parameters: StationParameters = {
            address: ['Gallen-Kallelas', AddressLanguage.SE],
            page: page,
            perPage: perPage
        }

        const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
        expect(response.statusCode).toEqual(200)

        const stations: StationsPage = response.body
        expect(stations.data.length).toBeGreaterThan(0)
        stations.data.forEach(s => expect(s.address_se).toContain('Gallen-Kallelas'))

    })

    test('Should return a 400 bad parameter error when address query parameter has invalid language',
        async () => {
            const parameters: StationParameters = {
                address: ['Gallen-Kallelas', 'en' as AddressLanguage],
                page: page,
                perPage: perPage
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toBe(400)

            testInstance.verifyBadParameter(response.body as IError, 'address', parameters.address,
                'language in [fi, se]', fullUrl, response.statusCode)
        })

    test('Should return a list of station satisfying capacity parameter', async () => {
        const parameters: StationParameters = {
            capacity: 10,
            page: page,
            perPage: perPage
        }
        const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
        expect(response.statusCode).toEqual(200)

        const stations: StationsPage = response.body
        expect(stations.data.length).toBeGreaterThan(0)
        stations.data.forEach(s => expect(s.capacity).toEqual(10))

    })

    test('Should return a 400 bad parameter error when capacity query parameter is out of bounds',
        async () => {
            const parameters: StationParameters = {
                capacity: -1,
                page: page,
                perPage: perPage
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toBe(400)

            testInstance.verifyBadParameter(response.body as IError, 'capacity', parameters.capacity,
                '>= 0', fullUrl, response.statusCode)
        })

    test('Should return a list of station satisfying operator parameter', async () => {
        const parameters: StationParameters = {
            operator: 'CityBike',
            page: page,
            perPage: perPage
        }
        const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
        expect(response.statusCode).toEqual(200)

        const stations: StationsPage = response.body
        expect(stations.data.length).toBeGreaterThan(0)
        stations.data.forEach(s => expect(s.operator).toContain('CityBike'))

    })

    test('Should return a list of station satisfying name parameter', async () => {
        const parameters: StationParameters = {
            name: ['Sepetlahdentie', NameLanguage.FI],
            page: page,
            perPage: perPage
        }

        const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
        expect(response.statusCode).toEqual(200)

        const stations: StationsPage = response.body
        expect(stations.data.length).toBeGreaterThan(0)
        stations.data.forEach(s => expect(s.name_fi).toContain('Sepetlahdentie'))

    })

    test('Should return a 400 bad parameter error when name query parameter has invalid language',
        async () => {
            const parameters: StationParameters = {
                name: ['Sepetlahdentie', 'ro' as NameLanguage],
                page: page,
                perPage: perPage
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(undefined, parameters)
            expect(response.statusCode).toBe(400)

            testInstance.verifyBadParameter(response.body as IError, 'name', parameters.name,
                'language in [fi, se, en]', fullUrl, response.statusCode)
        })

    test('Should return a list of station satisfying multiple parameters', async () => {
        const parameters: StationParameters = {
            name: ['Framnäsvägen', NameLanguage.SE],
            address: ['Kalastajantie 6', AddressLanguage.FI],
            operator: 'CityBike',
            page: page,
            perPage: perPage
        }

        const {response} = await testInstance.makeRequestWithParameters(undefined, parameters)
        expect(response.statusCode).toEqual(200)

        const stations: StationsPage = response.body
        expect(stations.data.length).toEqual(1)
        stations.data.forEach(s => expect(s.operator).toContain('CityBike'))
        stations.data.forEach(s => expect(s.name_se).toContain('Framnäsvägen'))
        stations.data.forEach(s => expect(s.address_fi).toContain('Kalastajantie'))
    })

})
