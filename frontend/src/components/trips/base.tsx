import { ReactNode } from "react"

interface Column {
    id: 'id' | 'departure_time' | 'return_time' | 'distance' | 'duration' | 'departure_station' | 'return_station',
    label: string
}

export const columns: Column[] = [
    {id: 'id', label: 'ID'},
    {id: 'departure_time', label: 'Departure time'},
    {id: 'departure_station', label: 'Departure station'},
    {id: 'return_time', label: 'Return time'},
    {id: 'return_station', label: 'Return station'},
    {id: 'distance', label: 'Distance [m]'},
    {id: 'duration', label: 'Duration [s]'},
]