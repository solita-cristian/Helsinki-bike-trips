import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React, { Fragment, ReactNode } from "react";
import { Station } from "../../models/Stations";
import Flag from 'react-world-flags';

interface Column {
    id: 'id' | 'name' | 'address' | 'city' | 'operator' | 'capacity',
    label: string
}

const columns: Column[] = [
    {id: 'id', label: 'ID'},
    {id: 'name', label: 'Name'},
    {id: 'address', label: 'Address'},
    {id: 'city', label: 'City'},
    {id: 'operator', label: 'Operator'},
    {id: 'capacity', label: 'Capacity'},
]

interface Data {
    id: ReactNode,
    name: ReactNode,
    address: ReactNode,
    city: ReactNode,
    operator: ReactNode,
    capacity: ReactNode
}


const constructCity = (station: Station, language: 'fi' | 'se') => {
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

const createData = (stations: Station[]): Data[] => {
    return stations.map(station => {
        return {
            id: <p className="station-column-single-name">
                {station.id}
            </p>,
            name: <p className="station-column-multiple-names">
                <span className="station-text">{station.name_fi}</span><Flag code='fin' height={12} className='flag'/><br/>
                <span className="station-text">{station.name_se}</span><Flag code='swe' height={12} className='flag'/><br/>
                <span className="station-text">{station.name_en}</span><Flag code='gbr' height={12} className='flag'/>
            </p>,
            address: <p className="station-column-multiple-names">
                <span className="station-text">{station.address_fi}</span><Flag code='fin' height={12} className='flag'/><br/>
                <span className="station-text">{station.address_se}</span><Flag code='swe' height={12} className='flag'/>
            </p>,
            city: <p className="station-column-multiple-names">
                {constructCity(station, 'fi')}<br/>
                {constructCity(station, 'se')}
            </p>,
            operator: <p className="station-column-single-name">
                {station.operator}
            </p>,
            capacity: <p className="station-column-single-name">
                {station.capacity}
            </p>
        }
    })
}

interface StationsTableProps {
    stations?: Station[],
    params: {page: number, perPage: number},
    updateParams: (newParams: Partial<{page: number, perPage: number}>) => void
}

const StationsTable = ({stations, params, updateParams}: StationsTableProps) => {
    return (
        <Paper>
            <TableContainer sx={{maxHeight: 500}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead >
                        <TableRow>
                            {columns.map(column => (
                                <TableCell key={column.id} align='center'>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            stations ?
                                createData(stations).map((station, index) => (
                                    <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                                        <TableCell>{station.id}</TableCell>
                                        <TableCell>{station.name}</TableCell>
                                        <TableCell>{station.address}</TableCell>
                                        <TableCell>{station.city}</TableCell>
                                        <TableCell>{station.operator}</TableCell>
                                        <TableCell>{station.capacity}</TableCell>
                                    </TableRow>
                                )) :
                                <></>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={stations ? stations.length : 0}
                rowsPerPage={params.perPage}
                page={params.page}
                onPageChange={(e, newPage) => {updateParams({page: newPage})}}
                onRowsPerPageChange={(e) => {updateParams({perPage: +e.target.value})}}
            />
        </Paper>
    )
}

export default StationsTable