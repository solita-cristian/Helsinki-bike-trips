import { Station } from "./Stations"

interface IPage<T> {
    data: T[]
    page: number
    perPage: number
    total: number
}

export type StationPage = IPage<Station>