import {Repository} from "typeorm";
import {NotFoundError, BadParameterError, Error} from "../../models/errors";
import {Response, Request} from "express";

/**
 * Defines a base API route controller
 */
export class BaseController<Entity> {

    constructor(protected readonly repository: Repository<Entity>) {}

    /**
     * Encapsulates error handling for unsuccessful operations
     *
     * @param res The response object
     * @param error An error object, describing the kind of error, as well as the request url that generated it
     */
    sendError = (res: Response, error: Error) => {
        return res.status(error.status).json(error)
    }

    /**
     * Encapsulates the sending of a response after a successful operation.
     *
     * @param res The response object
     * @param statusCode A HTTP status code, defaults to 200
     * @param data The data that will be sent. It makes no assumptions, so any validation has to be done beforehand.
     */
    sendResult = (res: Response, data: any, statusCode = 200) => {
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
    badParameterError = (req: Request, res: Response, parameterName: string, foundValue: any, expectedValue: any) => {
        const badParameterError = new BadParameterError(
            "A required missing parameter is badly formatted",
            `The parameter ${parameterName} has value ${foundValue}. Expected ${expectedValue}`,
            req.url
        )
        return this.sendError(res, badParameterError)
    }

    /**
     * Sends a 404 Not found error.
     * @param req The request
     * @param res The response
     * @param what The object name that was not found
     * @param propertyName The name of the property by which the requested object was not found
     * @param propertyValue The value of the property by which the requested object was not found
     */
    notFoundError = (req: Request, res: Response, what: string, propertyName: string, propertyValue: any) => {
        const notFoundError = new BadParameterError(
            `${what[0].toUpperCase() + what.substring(1)} not found`,
            `The ${what} with ${propertyName} = ${propertyValue} was not found`,
            req.url
        )
        return this.sendError(res, notFoundError);
    }

}