
export type TopInbound = {
    departure_station: number
    total: number
}

export type TopOutbound = {
    return_station: number
    total: number
}

export type StationStatistics = {
    totalInbound: number
    totalOutbound: number
    averageDistanceInbound: number
    averageDistanceOutbound: number
    topInbound: TopInbound[]
    topOutbound: TopOutbound[]
}