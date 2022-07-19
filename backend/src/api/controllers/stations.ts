import {Request, Response} from "express";
import {AppDataSource} from "../../database";
import {stations} from "../../models/stations";
import {BaseController} from "./base";
import {StationsPage} from "../../models/page";
import {AddressLanguage, NameLanguage, StationParameters} from "../../models/stationParameters";
import {StationStatistics} from "../../models/stationStatistics";


/**
 * Responsible for handling /stations requests.
 */
export class StationsController extends BaseController<stations> {
    constructor() {
        super(AppDataSource.getRepository('stations'));
    }

    getStationsCount = async () => {
        return await this.repository
            .createQueryBuilder('getStationsCount')
            .cache(true)
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
            const parameters = req.query as StationParameters

            const stationsCount = await this.getStationsCount();

            if (!parameters.page || parameters.page < 1)
                return this.badParameterError(req, res, 'page', parameters.page, '>= 1');
            else if (!parameters.perPage ||
                parameters.perPage < 1 ||
                parameters.perPage > stationsCount
            )
                return this.badParameterError(
                    req,
                    res,
                    'per_page',
                    parameters.perPage,
                    `1 <= per_page <= ${stationsCount}`);

            const builder = this.repository.createQueryBuilder('getAllStations').cache(true);

            // Since this evaluates to true, I don't have to add cumbersome logic for adding where clauses.
            builder.where('1=1')

            if (parameters.city) {
                if (!Object.values(AddressLanguage).includes(parameters.city[1]))
                    return this.badParameterError(req, res, 'city', parameters.city, 'language in [fi, se]')
                builder.andWhere(`city_${parameters.city[1]} = :city`,
                    {city: parameters.city[0]});
            }

            if (parameters.address) {
                if (!Object.values(AddressLanguage).includes(parameters.address[1]))
                    return this.badParameterError(req, res, 'address', parameters.address, 'language in [fi, se]')
                builder.andWhere(`address_${parameters.address[1]} like :address`,
                    {address: `%${parameters.address[0]}%`});
            }

            if (parameters.name) {
                if (!Object.values(NameLanguage).includes(parameters.name[1]))
                    return this.badParameterError(req, res, 'name', parameters.address, 'language in [fi, se, en]')
                builder.andWhere(`name_${parameters.name[1]} = :name`,
                    {name: parameters.name[0]});
            }

            if (parameters.operator)
                builder.andWhere(`operator like :operator`,
                    {operator: `%${parameters.operator}%`});

            if (parameters.capacity) {
                if (parameters.capacity < 0)
                    return this.badParameterError(req, res, 'capacity', parameters.capacity, '>= 0')
                builder.andWhere(`capacity = :capacity`,
                    {capacity: parameters.capacity});
            }

            // Define where the query starts fetching data. Default is 0 = start of the table
            builder.offset((parameters.page - 1) * parameters.perPage)
            // Limit the number of returned values to perPage
            builder.limit(parameters.perPage)

            this.sendResult(res, new StationsPage(
                await builder.getMany(),
                parameters.page,
                parameters.perPage
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
     */
    getStatistics = () => {
        return async (req: Request, res: Response) => {
            const {stationId} = req.params;
            const month = req.query.month;
            const station = await this.getStationById(stationId);

            if (!station)
                return this.notFoundError(req, res, 'station', 'ID', stationId);

            if (month) {
                let m = parseInt(month as any)
                if (m < 1 || m > 12)
                    return this.badParameterError(req, res, 'month', m, '1 <= month <= 12')
                this.sendResult(res, await StationStatistics.create(station, m))
            } else
                this.sendResult(res, await StationStatistics.create(station, null))
        }
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

}

/**
 * This is a workaround for swagger-express, because it needs that the name of the method is exactly the same that's
 * written in the `operationId` field in the .yaml files.
 */
const stationsController = new StationsController()

export const getAllStations = stationsController.getStations()
export const getStation = stationsController.getStation()
//export const searchStations = stationsController.getStations()
export const getStationStatistics = stationsController.getStatistics()
