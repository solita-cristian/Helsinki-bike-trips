import {Request, Response} from 'express'
import {AppDataSource} from '../../database'
import {stations} from '../../models/stations'
import {BaseController} from './base'
import {StationsPage} from '../../models/page'
import {StationParameters} from '../../models/parameters/station'
import {StationStatistics} from '../../models/stationStatistics'


/**
 * Responsible for handling /stations requests.
 */
export class StationsController extends BaseController<stations> {
    constructor() {
        super(AppDataSource.getRepository('stations'))
    }

    getStationsCount = async () => {
        return await this.repository
            .createQueryBuilder('getStationsCount')
            .cache(true)
            .getCount()
    }

    /**
     * Returns all stations from the database.
     *
     * The stations are fetched using pagination, using the **required** query parameters `page` and `per_page`.
     *
     * The stations can be searched.
     */
    getStations = () => {
        return async (req: Request, res: Response) => {
            const parameters = req.query as StationParameters

            const stationsCount = await this.getStationsCount()

            const builder = this.repository.createQueryBuilder('getAllStations').cache(true)

            switch (this.paginate<stations>(req, res, parameters, builder, stationsCount)) {
            case -1:
                return this.badParameterError(req, res, 'page', parameters.page, '>= 0')
            case -2:
                return this.badParameterError(req, res, 'perPage', parameters.perPage, `1 <= perPage <= ${stationsCount}`)
            default:
                break
            }

            if (parameters.city) {
                builder.andWhere('city_fi LIKE :city', {city: `%${parameters.city}%`})
                builder.orWhere('city_se LIKE :city', {city: `%${parameters.city}%`})
            }

            if (parameters.address) {
                builder.andWhere('address_fi like :address', {address: `%${parameters.address}%`})
                builder.orWhere('address_se like :address', {address: `%${parameters.address}%`})
            }

            if (parameters.name) {
                builder.andWhere('name_fi LIKE :name', {name: `%${parameters.name}%`})
                builder.orWhere('name_se LIKE :name', {name: `%${parameters.name}%`})
                builder.orWhere('name_en LIKE :name', {name: `%${parameters.name}%`})
            }

            if (parameters.operator)
                builder.andWhere('operator like :operator', {operator: `%${parameters.operator}%`})

            if (parameters.capacity) {
                if (parameters.capacity < 0)
                    return this.badParameterError(req, res, 'capacity', parameters.capacity, '>= 0')
                builder.andWhere('capacity = :capacity', {capacity: parameters.capacity})
            }

            this.sendResult(res, new StationsPage(
                await builder.getMany(),
                parameters.page as number,
                parameters.perPage as number,
                stationsCount
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

            if (station)
                this.sendResult(res, station)
            else
                this.notFoundError(req, res, 'station', 'ID', stationId)
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
            const {stationId} = req.params
            const month = req.query.month
            const station = await this.getStationById(stationId)

            if (!station)
                return this.notFoundError(req, res, 'station', 'ID', stationId)

            if (month) {
                const m = parseInt(month as string)
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
            .getOne()
    }

}

/**
 * This is a workaround for swagger-express, because it needs that the name of the method is exactly the same that's
 * written in the `operationId` field in the .yaml files.
 */
const stationsController = new StationsController()

export const getAllStations = stationsController.getStations()
export const getStation = stationsController.getStation()
export const getStationStatistics = stationsController.getStatistics()
