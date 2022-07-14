import {Request, Response} from "express";
import {AppDataSource} from "../../../database";
import {stations} from "../../../models/stations";
import {buildError} from "../../../models/errors";

const stationsTable = AppDataSource.getRepository('stations')

/**
 * Returns all stations from the database
 * @param req The request
 * @param res The response
 */
export const getAllStations = async (req: Request, res: Response) => {
    const stations = await stationsTable
        .createQueryBuilder('getAllStations')
        .cache(true)
        .getMany()
    res.status(200).json(stations)
}

/**
 * Returns a station based on the passed ID if exists, an error message otherwise.
 * @param req The request
 * @param res The response
 */
export const getStation = async (req: Request, res: Response) => {
    const {stationId} = req.params

    stationsTable
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