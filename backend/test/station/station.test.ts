import {stations} from '../../src/models/stations'
import '../base'
import {IError} from '../../src/models/errors'
import {BaseTestInstance} from '../base'
import {AppDataSource} from '../../src/database'


/**
 * Defines a test instance specifically for testing a single station
 */
class StationTestInstance extends BaseTestInstance {
    /**
     * Constructs a new test instance
     */
    constructor() {
        super('station', '/stations')
    }
}

const testInstance = new StationTestInstance()

beforeAll(async () => {
    await AppDataSource.initialize()
})

afterAll(async () => {
    await AppDataSource.destroy()
})

describe('Station', () => {
    const validId = 501
    const invalidId = 9999

    test('Should be returned when given valid ID', async () => {
        const {response} = await testInstance.makeRequestWithParameters(validId)

        // Check if the returned station is not null and has the correct ID
        const station = response.body as stations
        expect(station).toBeTruthy()
        expect(station.id).toEqual(validId)
    })

    test('Should return a \'404 not found\' error message when is not found', async () => {
        const {fullUrl, response} = await testInstance.makeRequestWithParameters(invalidId)
        expect(response.statusCode).toBe(404)

        testInstance.verifyNotFound(response.body as IError, response.statusCode, fullUrl, 'ID', invalidId.toString())
    })

})
