import { ReactNode } from "react"
import React from "react"
import { Station } from "../../models/Station"
import Flag from "react-world-flags"

/**
 * Defines all the valid columns in a stations table
 */
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

/**
 * Defines how each property of the station should be displayed in the table
 */
export interface Data {
    id: number,
    name: ReactNode,
    address: ReactNode,
    city: ReactNode,
    operator: ReactNode,
    capacity: ReactNode
}

/**
 * Construct a component showing the station's city name and language flag 
 * @param station The station
 * @param language The language
 * @returns A component composed of the city name and a flag indicating its language
 */
export const constructCity = (station: Station, language: 'fi' | 'se') => {
    if(language === 'fi' && station.city_fi)
            return (
                <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
                <span className="station-text">{station.city_fi}</span><Flag code='fin' height={12} className='flag'/>
                </div>
            )
    else if(language === 'se' && station.city_se)
        return (
            <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
            <span className="station-text">{station.city_se}</span><Flag code='swe' height={12} className='flag'/>
            </div>
        )
    return (<></>)
}