
import { Fragment } from 'react'
import useApi from '../../hooks/Api'
import useQueryParams from '../../hooks/Params'
import { TripsPage } from '../../models/Page'
import { StationsParams, TripsParams } from '../../models/Params'
import { CircularProgress, Stack, Typography } from '@mui/material'
import TripsTable from './TripsTable'
import TripsFilterForm from '../form/TripsFilterForm'
import './Trips.scss'


/**
 * Defines a trips page component, which will display the paginated data and the filtering form
 * @returns The trips page component
 */
function Trips() {
    const {params, debouncedUpdateParams, clearParams} = useQueryParams<TripsParams>({
        page: 0,
        perPage: 10,
        departure: undefined,
        return: undefined,
        duration: undefined,
        distance: undefined
    })
    const {response, error, isLoading} = useApi<TripsPage>({
        baseURL: `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/trips`,
        params: params
    })

    if(error && !response) {
        return (
            <Fragment>
                <Typography variant='h6'>An error occured. Please try reloading the page. {error.message}</Typography>
            </Fragment>
        )
    }
    else if(isLoading) {
        return (
            <Fragment>
                <CircularProgress />
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Stack sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography variant='h2' className='title'>Bike trips</Typography>
                <TripsFilterForm params={params} updateParams={debouncedUpdateParams} clearParams={clearParams} />
                <TripsTable
                    key='stations-table'
                    trips={response}
                    params={params as Required<StationsParams>}
                    updateParams={debouncedUpdateParams} />
            </Stack>
        </Fragment>
    )
}

export default Trips