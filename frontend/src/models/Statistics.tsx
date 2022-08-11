
/**
 * Defines one of the most visited stations from which the trip starts
 */
export type TopInbound = {
    departure_station: number
    total: number
}

/**
 * Defines one of the most visited stations from which the trip ends
 */
export type TopOutbound = {
    return_station: number
    total: number
}

/**
 * Defines a station statistics object
 */
export type StationStatistics = {
    totalInbound: number
    totalOutbound: number
    averageDistanceInbound: number
    averageDistanceOutbound: number
    topInbound: TopInbound[]
    topOutbound: TopOutbound[]
}