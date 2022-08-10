import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import React from "react";
import { Station } from "../../models/Station";
import Flag from 'react-world-flags';
import { StationsParams } from "../../models/Params";
import { StationPage } from "../../models/Page";
import { columns, constructCity, Data } from "./base";
import {Link} from 'react-router-dom'

const createData = (stations: Station[]): Data[] => {
    return stations.map(station => {
        return {
            id: station.id,
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
            operator: station.operator,
            capacity: station.capacity
        }
    })
}

interface StationsTableProps {
    stations?: StationPage,
    params: StationsParams,
    updateParams: (newParams: Partial<StationsParams>) => void
}

const StationsTable = ({stations, params, updateParams}: StationsTableProps) => {
    return (
        <Paper sx={{width: '80%', position: 'inherit'}}>
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
                            stations?.data ?
                                createData(stations?.data).map((station, index) => (
                                    <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                                        <TableCell align="center">
                                            <Link to={`/stations/${station.id}`}>
                                                {station.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{station.name}</TableCell>
                                        <TableCell>{station.address}</TableCell>
                                        <TableCell>{station.city}</TableCell>
                                        <TableCell align='center'>{station.operator}</TableCell>
                                        <TableCell align="center">{station.capacity}</TableCell>
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
                count={stations ? stations.total : 0}
                rowsPerPage={params.perPage}
                page={params.page}
                onPageChange={(e, newPage) => {updateParams({page: newPage})}}
                onRowsPerPageChange={(e) => {updateParams({perPage: +e.target.value})}}
            />
        </Paper>
    )
}

export default StationsTable