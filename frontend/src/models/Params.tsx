/**
 * Defines the bare minimum query parameters
 */
export interface Params {
    page: number,
    perPage: number
}

/**
 * Defines the query parameters for the /stations route
 */
export interface StationsParams extends Params {
    name?: string,
    address?: string,
    city?: string,
    operator?: string,
    capacity?: number
}

/**
 * Defines the query parameters for the /trips route
 */
export interface TripsParams extends Params {
    departure?: number
    return?: number
    duration?: number
    distance?: number
}