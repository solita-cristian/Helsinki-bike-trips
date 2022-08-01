/**
 * Defines the properties which every error should have
 */
export interface IError {
    id: string,
    title: string,
    status: number,
    detail: string,
    instance: string
}

/**
 * Base Error class
 */
export abstract class Error implements IError {
    readonly id: string
    readonly title: string
    readonly status: number
    readonly detail: string
    readonly instance: string

    protected constructor(id: string, title: string, status: number, detail: string, instance: string) {
        this.id = id
        this.title = title
        this.status = status
        this.detail = detail
        this.instance = instance
    }
}

/**
 * Defines a 404-Not found error
 */
export class NotFoundError extends Error {
    constructor(title: string, detail: string, instance: string) {
        super('Not found', title, 404, detail, instance)
    }
}

/**
 * Defines a 400-Bad parameter error
 */
export class BadParameterError extends Error {
    constructor(title: string, detail: string, instance: string) {
        super('Badly formatted parameter', title, 400, detail, instance)
    }
}