import { Station } from "./Station"

interface IPage<T> {
    data: T[]
    page: number
    perPage: number
    total: number
}

export type StationPage = IPage<Station>