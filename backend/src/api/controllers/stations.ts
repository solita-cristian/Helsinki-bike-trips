import {Request, Response} from "express";
import {AppDataSource} from "../../database";
import {stations} from "../../models/stations";
import {buildError} from "../../models/errors";
import {trips} from "../../models/trips";

const stations_repository = AppDataSource.getRepository('stations')
const trips_repository = AppDataSource.getRepository('trips')

/**
 * Returns all stations from the database.
 *
 * The stations are fetched using pagination, using the **required** query parameters `page` and `per_page`.
 *
 * The stations can be sorted with the `sort` **optional** query parameter, which accepts 'asc' or 'desc'.
 * @param req The request
 * @param res The response
 */
export const getAllStations = async (req: Request, res: Response) => {

    if (!req.query.page || !req.query.per_page)
        return res.status(400).json(buildError(
                "Missing parameter",
                "A required missing parameter was found",
                400,
                `The parameters page and per_page are expected, but are undefined`,
                req.url
            ))

    const builder = stations_repository.createQueryBuilder('getAllStations').cache(true);

    const sort: any = req.query.sort;

    if (sort) {
        if(['asc', 'desc'].includes(sort))
            builder.orderBy('id', sort.toUpperCase())
        else
            return res.status(400).json(buildError(
                "Bad parameter",
                "A badly formatted parameter was found",
                400,
                `The parameter sort has value ${sort}. Expected ['asc', 'desc'] `,
                req.url
            ))
    }

    const page: number = parseInt(req.query.page as any);
    const perPage: number = parseInt(req.query.per_page as any);

    // Define where the query starts fetching data. Default is 0 = start of the table
    builder.offset((page - 1) * perPage)
    // Limit the number of returned values to perPage
    builder.limit(perPage)

    res.status(200).json({
        data: await builder.getMany(),
        page,
        perPage,
    })
}

/**
 * Returns a station based on the passed ID if exists, an error message otherwise.
 * @param req The request
 * @param res The response
 */
export const getStation = async (req: Request, res: Response) => {
    const {stationId} = req.params

    stations_repository
        .createQueryBuilder('getStationById')
        .cache(true)
        .where('id = :stationId', {stationId: stationId})
        .getOneOrFail()
        .then(station => res.status(200).json(station))
        .catch(error => res.status(404).json(buildError(
            "Not found",
            "Station not found",
            404,
            error,
            req.url
        )))
}

const sumDistances = (accumulatedTotal: number, currentDistance: number) => {
    return accumulatedTotal + currentDistance;
}

/**
 * Returns the average distance of the trips.
 * @param trips A list of trips
 */
const getAverageDistance = (trips: trips[]) => {
    return parseFloat((trips
                    .map(t => t.distance)
                    .reduce(sumDistances, 0)/trips.length)
                    .toFixed(2))
}

/**
 * Fetches the top 5 stations which start or finish at the requested station.
 *
 * @param outbound A boolean value indicating if the stations are the starting or ending point of the trip
 * @param month The month of the year. Used to filter the trips by month. If set to `null` will fetch all trips.
 * @param stationId The ID of the requested station
 */
const getTopStations = async (outbound: boolean, month: number | null, stationId: string) => {
    const station = (outbound ? 'return' : 'departure') + '_station';
    const opp_station = (outbound ? 'departure' : 'return') + '_station';

    return (await trips_repository
        .createQueryBuilder('getTopStations')
        .select(`${station}, COUNT(*) as total`)
        .where(`${month ? `extract(MONTH from departure_time) = :month and` : ''} ${opp_station} = :stationId`,
            {month: month, stationId: parseInt(stationId)})
        .groupBy(`${station}`)
        .orderBy('total', 'DESC')
        .cache(true)
        .getRawMany<stations>()).slice(0, 5);
}

/**
 * Encapsulated a mapping function which will generate all the statistics for a station.
 *
 * @param outbound_trips The station's outbound trips
 * @param inbound_trips The station's inbound trips
 * @param stationId The ID of the station
 */
const calculateStatisticsPerMonth = (outbound_trips: trips[], inbound_trips: trips[], stationId: string) =>
    async (month: number) => {
        const outbound = outbound_trips.filter(t => t.departure_time.getMonth() === month);
        const inbound = inbound_trips.filter(t => t.departure_time.getMonth() === month);
        const average_distance_inbound = getAverageDistance(inbound)
        const average_distance_outbound = getAverageDistance(outbound)

        return {
            total_inbound: inbound.length,
            total_outbound: outbound.length,
            average_distance_inbound,
            average_distance_outbound,
            top_outbound: await getTopStations(true, month + 1, stationId),
            top_inbound: await getTopStations(false, month + 1, stationId)
        }
    }


/**
 * Returns the statistics concerning a station, given its ID, divided pe month, as well as considering the whole.
 *
 * The statistics are:
 *
 * - Total number of trips starting from the station
 * - Total number of trips ending at the station
 * - The average distance of a trip starting from the station
 * - The average distance of a trip ending at the station
 * - Top 5 most popular return stations for trips starting from the station
 * - Top 5 most popular departure stations for journeys ending at the station
 *
 *
 * @param req The request
 * @param res The response
 */
export const getStationStatistics = async (req: Request, res: Response) => {
    const {stationId} = req.params;
    const month = req.query.month

    if (month) {
        let m = parseInt(month as any)
        if(m < 1 || m > 12)
            return res.status(400).json(buildError(
                "Bad parameter",
                "A badly formatted parameter was found",
                400,
                `The parameter month has value ${m}. Expected between [1, 12].`,
                req.url
            ))
    }

    const station = await stations_repository
        .createQueryBuilder()
        .where('stations.id = :id', {id: stationId})
        .cache(true)
        .getOne();

    if (!station)
        return res.status(404).json(buildError(
            "Not found",
            "Station not found",
            404,
            `The station with ID ${stationId} was not found`,
            req.url
        ))


    let outbound_trips = await (station as stations).outbound_trips;
    let inbound_trips = await (station as stations).inbound_trips;

    const average_distance_inbound = getAverageDistance(inbound_trips)
    const average_distance_outbound = getAverageDistance(outbound_trips)

    const stats = await Promise.all(
        (month ?
            [parseInt(month as any) - 1] :
            [...Array(12).keys()]
        ).map(
            calculateStatisticsPerMonth(outbound_trips, inbound_trips, stationId)
    ))

    res.status(200).json(
        !month ? [{
            total_inbound: inbound_trips.length,
            total_outbound: outbound_trips.length,
            average_distance_inbound,
            average_distance_outbound,
            top_outbound: await getTopStations(true, null, stationId),
            top_inbound: await getTopStations(false, null, stationId)
        },
        ...stats] :
        stats
    )

}