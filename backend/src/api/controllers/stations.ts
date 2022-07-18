import {Request, Response} from "express";
import {AppDataSource} from "../../database";
import {stations} from "../../models/stations";
import {trips} from "../../models/trips";
import {BaseController} from "./base";
import {StationsPage} from "../../models/page";


/**
 * Responsible for handling /stations requests.
 */
export class StationsController extends BaseController<stations> {
    constructor() {
        super(AppDataSource.getRepository('stations'));
    }

    /**
     * Returns a station if it exists, a 404 not found error otherwise
     * @param stationId The ID of the requested station
     */
    private getStationById = async (stationId: string) => {
        return await this.repository
            .createQueryBuilder('getStationById')
            .cache(true)
            .where('id = :stationId', {stationId: stationId})
            .getOne();
    }

    getStationsCount = async () => {
        return await this.repository
            .createQueryBuilder('getStationsCount')
            .getCount();
}


    /**
     * Returns all stations from the database.
     *
     * The stations are fetched using pagination, using the **required** query parameters `page` and `per_page`.
     *
     * The stations can be sorted with the `sort` **optional** query parameter, which accepts 'asc' or 'desc'.
     */
    getStations = () => {
        return async (req: Request, res: Response) => {
            const {page, per_page} = req.query;
            const stationsCount = await this.getStationsCount();

            if (!page || parseInt(page as string) < 1)
                return this.badParameterError(req, res, 'page', page, '>= 1');
            else if(!per_page ||
                parseInt(per_page as string) < 1 ||
                parseInt(per_page as string) > stationsCount
            )
                return this.badParameterError(
                    req,
                    res,
                    'per_page',
                    per_page,
                    `1 <= per_page <= ${stationsCount}`);

            const builder = this.repository.createQueryBuilder('getAllStations').cache(true);

            const iPage: number = parseInt(req.query.page as any);
            const perPage: number = parseInt(req.query.per_page as any);

            // Define where the query starts fetching data. Default is 0 = start of the table
            builder.offset((iPage - 1) * perPage)
            // Limit the number of returned values to perPage
            builder.limit(perPage)

            this.sendResult(res, new StationsPage(
                await builder.getMany(),
                iPage,
                perPage
            ))
        }
    }

    /**
     * Returns a station based on the passed ID if exists, an error message otherwise.
     */
    getStation = () => {
        return async (req: Request, res: Response) => {
            const {stationId} = req.params

            const station = await this.getStationById(stationId)

            return station ?
                this.sendResult(res, station) :
                this.notFoundError(req, res, 'station', 'ID', stationId);
        }
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
        !month ? { total : {
            total_inbound: inbound_trips.length,
            total_outbound: outbound_trips.length,
            average_distance_inbound,
            average_distance_outbound,
            top_outbound: await getTopStations(true, null, stationId),
            top_inbound: await getTopStations(false, null, stationId)
        },
        monthly: [...stats]} :
        stats
    )

}