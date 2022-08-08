import { Station } from "./Station"

export type Trip = {
    id: number
    departure_time: number
    return_time: number
    departure_station: Station
    return_station: Station
    distance: number
    duration: number
}