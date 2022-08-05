import { CircularProgress, Grid, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import Flag from 'react-world-flags'
import useApi from '../../../hooks/Api'
import {Station} from '../../../models/Station'
import { StationStatistics } from '../../../models/Statistics'
import { constructCity, Data } from '../base'

interface StationProps {
    id: number
}

const TripsData = (stats: StationStatistics, inbound = true) => {
    return (
        <Fragment>
            <TableRow>
                <TableCell rowSpan={8} colSpan={2}><strong>{inbound ? 'Arriving' : 'Departing'} trips</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell align='right' colSpan={2}>{inbound ? stats.totalInbound : stats.totalOutbound}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell><strong>Average distance</strong></TableCell>
                <TableCell align='right' colSpan={2}>{inbound ? stats.averageDistanceInbound : stats.averageDistanceOutbound} m</TableCell>
            </TableRow>
            <TableRow>
                <TableCell rowSpan={6}><strong>Top 5</strong></TableCell>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell align='right'><strong>Total trips</strong></TableCell>
            </TableRow>
            {inbound ?
                stats.topInbound.map(s => {
                    return (
                        <TableRow key={s.departure_station}>
                            <TableCell>{s.departure_station}</TableCell>
                            <TableCell align='right'>{s.total}</TableCell>
                        </TableRow>
                    )
                }) :
                stats.topOutbound.map(s => {
                    return (
                        <TableRow key={s.return_station}>
                            <TableCell>{s.return_station}</TableCell>
                            <TableCell align='right'>{s.total}</TableCell>
                        </TableRow>
                    )
                })}
        </Fragment>
    )
}

const createData = (station: Station): Data => {
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
}

const StationStats = (stats?: StationStatistics) => {
    if(!stats) return (<></>)

    return (
        <Fragment>
            {TripsData(stats)}
            {TripsData(stats, false)}
        </Fragment>
    )
}

const StationData = (station?: Station, stats?: StationStatistics) => {
    if(!station) return (<></>)

    const s = createData(station)
    
    return (
            <Table stickyHeader sx={{width: '70%'}}>
                <TableRow>
                    <TableCell colSpan={2}><strong>Name</strong></TableCell>
                    <TableCell align='right' colSpan={3}>{s.name}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2}><strong>Address</strong></TableCell>
                    <TableCell align='right' colSpan={3}>{s.address}</TableCell>
                </TableRow>
                {StationStats(stats)}
            </Table>
    )
}


export default function StationPage({id}: StationProps) {

    const [month, setMonth] = useState(undefined)

    const station = useApi<Station>({
        baseURL: `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/stations/${id}`,
    })

    const statistics = useApi<StationStatistics>({
        baseURL: `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/stations/${id}/stats`,
        params: {
            month
        }
    })

    if(station.isLoading) {
        return (
            <Fragment>
                <CircularProgress />
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Typography variant='h3'>
                Station {id}
            </Typography>
            <Grid container>
                <Grid item md={6}></Grid>
                <Grid item md={6} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {StationData(station.response, statistics.response)}
                </Grid>
            </Grid>
        </Fragment>
    )
}
