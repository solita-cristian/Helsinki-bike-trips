import {ObjectLiteral, Repository, SelectQueryBuilder} from 'typeorm'
import {BadParameterError, Error, NotFoundError} from '../../models/errors'
import {Request, Response} from 'express'
import {BaseParameters} from '../../models/parameters/base'

type sendable = string | object | undefined

/**
 * Defines a base API route controller
 */
export class BaseController<Entity extends ObjectLiteral> {

    constructor(protected readonly repository: Repository<Entity>) {
    }

    /**
     * Encapsulates error handling for unsuccessful operations
     *
     * @param res The response object
     * @param error An error object, describing the kind of error, as well as the request url that generated it
     */
    sendError = (res: Response, error: Error) => {
        res.status(error.status).json(error)
    }

    /**
     * Encapsulates the sending of a response after a successful operation.
     *
     * @param res The response object
     * @param statusCode A HTTP status code, defaults to 200
     * @param data The data that will be sent. It makes no assumptions, so any validation has to be done beforehand.
     */
    sendResult = (res: Response, data: sendable, statusCode = 200) => {
        res.status(statusCode).send(data)
    }

    /**
     * Sends a 400 bad parameter error
     * @param req The request
     * @param res The response
     * @param parameterName The name of the bad parameter
     * @param foundValue The value of the bad parameter
     * @param expectedValue The expected value of the bad parameter
     */
    badParameterError = (req: Request, res: Response, parameterName: string, foundValue: unknown, expectedValue: unknown) => {
        const badParameterError = new BadParameterError(
            'A required missing parameter is badly formatted',
            `The parameter ${parameterName} has value ${foundValue}. Expected ${expectedValue}`,
            req.url
        )
        this.sendError(res, badParameterError)
    }

    /**
     * Sends a 404 Not found error.
     * @param req The request
     * @param res The response
     * @param what The object name that was not found
     * @param propertyName The name of the property by which the requested object was not found
     * @param propertyValue The value of the property by which the requested object was not found
     */
    notFoundError = (req: Request, res: Response, what: string, propertyName: string, propertyValue: unknown) => {
        const notFoundError = new NotFoundError(
            `${what} not found`,
            `The ${what} with ${propertyName} = ${propertyValue} was not found`,
            req.url
        )
        return this.sendError(res, notFoundError)
    }

    /**
     * Enables the builder to paginate the query results
     * @param req The request
     * @param res The response
     * @param parameters The parameters object, which contains the `page` and `perPage` properties.
     * @param builder The query builder
     * @param maxPerPage The maximum amount of items per page.
     */
    paginate<T>(req: Request, res: Response, parameters: BaseParameters, builder: SelectQueryBuilder<T>, maxPerPage: number) {
        if (!parameters.page || parameters.page < 1)
            return -1
        else if (!parameters.perPage || parameters.perPage < 1 || parameters.perPage > maxPerPage)
            return -2

        builder.offset((parameters.page - 1) * parameters.perPage)
        builder.limit(parameters.perPage)
        return 0
    }


}