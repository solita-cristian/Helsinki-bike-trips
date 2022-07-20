import '../base'
import {IError} from '../../src/models/errors'
import {BaseTestInstance} from "../base";
import {AppDataSource} from "../../src/database";
import {StationStatistics} from "../../src/models/stationStatistics";
import {StatisticsParameters} from "../../src/models/parameters/station";


class StatisticsTestInstance extends BaseTestInstance {
    constructor() {
        super('station', '/stations');
    }

    verifyStatistics = (statistics: StationStatistics) => {
        expect(statistics).toBeTruthy();
        expect(statistics.topInbound).toHaveLength(5);
        expect(statistics.topOutbound).toHaveLength(5);
        expect(statistics.totalInbound).toBeTruthy();
        expect(statistics.totalOutbound).toBeTruthy();
        expect(statistics.averageDistanceInbound).toBeTruthy();
        expect(statistics.averageDistanceOutbound).toBeTruthy();
    }
}

const testInstance = new StatisticsTestInstance();

beforeAll(async () => {
    await AppDataSource.initialize();
})

afterAll(async () => {
    await AppDataSource.destroy();
})

describe("Statistics", () => {
    const validId = 501
    const invalidId = 9999

    test("Should be returned when given valid ID", async () => {
        const {response} = await testInstance.makeRequestWithParameters(`${validId}/stats`)
        testInstance.verifyStatistics(response.body as StationStatistics);
    })

    test("Should return a '404 not found' error message when is not found", async () => {
        const {fullUrl, response} = await testInstance.makeRequestWithParameters(`${invalidId}/stats`);
        expect(response.statusCode).toBe(404);

        testInstance.verifyNotFound(response.body as IError, response.statusCode, fullUrl, 'ID', invalidId)
    })

    test('Should return a 400 bad parameter error when month query parameter is out of bounds',
        async () => {
            const parameters: StatisticsParameters = {
                month: 0
            }
            const {fullUrl, response} = await testInstance.makeRequestWithParameters(`${validId}/stats`, parameters);
            expect(response.statusCode).toBe(400);

            testInstance.verifyBadParameter(response.body as IError, 'month', parameters.month, '1 <= month <= 12',
                fullUrl, response.statusCode)
        })

    test('Should return the statistics of the month when month query parameter is defined',
        async () => {
            const parameters: StatisticsParameters = {
                month: 5
            }
            const {response} = await testInstance.makeRequestWithParameters(`${validId}/stats`, parameters);
            testInstance.verifyStatistics(response.body as StationStatistics);

        })

})
