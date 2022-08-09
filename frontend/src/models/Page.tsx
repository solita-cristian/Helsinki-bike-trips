import { Station } from "./Station"
import { Trip } from "./Trip"

interface IPage<T> {
    data: T[]
    page: number
    perPage: number
    total: number
}

export type StationPage = IPage<Station>
export type TripsPage = IPage<Trip>