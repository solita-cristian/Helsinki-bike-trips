import {stations} from './stations'
import {trips} from './trips'

/**
 * Defines the minimum properties a paginated object should have
 */
interface IPage<T> {
    data: T[]
    perPage: number,
    page: number
}

/**
 * Defines a generic paginated object
 */
export abstract class Page<T> implements IPage<T> {
    public data: T[]
    public page: number
    public perPage: number

    constructor(data: T[], page: number | string, perPage: number | string) {
        this.data = data
        this.page = (typeof page === 'string' ? parseInt(page) : page)
        this.perPage = (typeof perPage === 'string' ? parseInt(perPage) : perPage)
    }
}

/**
 * Defines a paginated object hosting stations
 */
export class StationsPage extends Page<stations> {
}

/**
 * Defines a paginated object hosting trips
 */
export class TripsPage extends Page<trips> {
}