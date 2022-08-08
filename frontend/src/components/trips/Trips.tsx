
import { Fragment } from 'react'
import useApi from '../../hooks/Api'
import useQueryParams from '../../hooks/Params'
import { TripsPage } from '../../models/Page'
import { StationsParams, TripsParams } from '../../models/Params'
import { CircularProgress, Typography } from '@mui/material'
import TripsTable from './TripsTable'


function Trips() {
    const {params, debouncedUpdateParams, clearParams} = useQueryParams<TripsParams>({
        page: 0,
        perPage: 10,
    })
    const {response, error, isLoading} = useApi<TripsPage>({
        baseURL: `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/trips`,
        params: params
    })

    if(error && !response) {
        return (
            <Fragment>
                <Typography variant='h6'>An error occured. Please try reloading the page</Typography>
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
            {error && !response ?
                <p>{error.message}</p> : 
                <TripsTable
                    key='stations-table'
                    trips={response}
                    params={params as Required<StationsParams>}
                    updateParams={debouncedUpdateParams} />
            }
        </Fragment>
    )
}

export default Trips