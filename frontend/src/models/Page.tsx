import { Station } from "./Station"
import { Trip } from "./Trip"

/**
 * Defines a generic page object
 */
interface IPage<T> {
    data: T[]
    page: number
    perPage: number
    total: number
}

/**
 * Defines a page of stations
 */
export type StationPage = IPage<Station>
/**
 * Defines a page of trips
 */
export type TripsPage = IPage<Trip>