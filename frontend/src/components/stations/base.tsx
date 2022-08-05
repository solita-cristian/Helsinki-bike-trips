import { ReactNode } from "react"
import React from "react"
import { Station } from "../../models/Station"
import Flag from "react-world-flags"

interface Column {
    id: 'id' | 'name' | 'address' | 'city' | 'operator' | 'capacity',
    label: string
}

export const columns: Column[] = [
    {id: 'id', label: 'ID'},
    {id: 'name', label: 'Name'},
    {id: 'address', label: 'Address'},
    {id: 'city', label: 'City'},
    {id: 'operator', label: 'Operator'},
    {id: 'capacity', label: 'Capacity'},
]

export interface Data {
    id: ReactNode,
    name: ReactNode,
    address: ReactNode,
    city: ReactNode,
    operator: ReactNode,
    capacity: ReactNode
}


export const constructCity = (station: Station, language: 'fi' | 'se') => {
    if(language === 'fi' && station.city_fi)
            return (
                <>
                <span className="station-text">{station.city_fi}</span><Flag code='fin' height={12} className='flag'/>
                </>
            )
    else if(language === 'se' && station.city_se)
        return (
            <>
            <span className="station-text">{station.city_se}</span><Flag code='swe' height={12} className='flag'/>
            </>
        )
    return (<></>)
}