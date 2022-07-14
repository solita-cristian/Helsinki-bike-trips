import {Request, Response} from "express";
import {AppDataSource} from "../../database";
import {stations} from "../../models/stations";
import {buildError} from "../../models/errors";

const stationsTable = AppDataSource.getRepository('stations')

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

    const builder = stationsTable.createQueryBuilder('getAllStations').cache(true);

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