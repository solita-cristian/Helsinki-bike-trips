import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material"
import { Link } from "react-router-dom"
import { TripsPage } from "../../models/Page"
import { TripsParams } from "../../models/Params"
import { columns } from "./base"

interface TripsTableProps {
    trips?: TripsPage,
    params: TripsParams,
    updateParams: (newParams: Partial<TripsParams>) => void
}

const TripsTable = ({trips, params, updateParams}: TripsTableProps) => {
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
                            trips?.data ?
                                trips.data.map((trip, index) => (
                                    <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                                        <TableCell align='center'>{trip.id}</TableCell>
                                        <TableCell align='center'>{new Date(trip.departure_time).toLocaleString()}</TableCell>
                                        <TableCell align='center'>
                                            <Link to={`/stations/${trip.departure_station.id}`}>
                                                {trip.departure_station.id}
                                                </Link>
                                        </TableCell>
                                        <TableCell align='center'>{new Date(trip.return_time).toLocaleString()}</TableCell>
                                        <TableCell align='center'>
                                            <Link to={`/stations/${trip.return_station.id}`}>
                                                {trip.return_station.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell align='center'>{trip.distance}</TableCell>
                                        <TableCell align='center'>{trip.duration}</TableCell>
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
                count={trips ? trips.total : 0}
                rowsPerPage={params.perPage}
                page={params.page}
                onPageChange={(e, newPage) => {updateParams({page: newPage})}}
                onRowsPerPageChange={(e) => {updateParams({perPage: +e.target.value})}}
            />
        </Paper>
    )
}

export default TripsTable