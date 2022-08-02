
import { Fragment } from 'react'
import useApi from '../../hooks/Api'
import useParams from '../../hooks/Params'
import { StationPage } from '../../models/Stations'
import StationsTable from './StationsTable'
import './Stations.scss'
import FilterForm from './FilterForm'
import { StationsParams } from '../../models/Params'


function Stations() {
    const {params, debouncedUpdateParams, clearParams} = useParams<StationsParams>({
        page: 1,
        perPage: 10,
        name: undefined,
        address: undefined,
        city: undefined,
        operator: undefined,
        capacity: undefined
    })
    const {response, error, isLoading} = useApi<StationPage>({
        baseURL: 'http://localhost:8080/stations',
        params: params
    })

    console.log(response, error, isLoading)

    if(error && !response) {
        return (
            <Fragment>
                
            </Fragment>
        )
    }

    return (
        <Fragment>
            <FilterForm params={params} updateParams={debouncedUpdateParams} clearParams={clearParams}/>
            {error && !response ?
                <p>{error.message}</p> : 
                <StationsTable 
                    stations={response?.data}
                    params={params as Required<StationsParams>}
                    updateParams={debouncedUpdateParams} />
            }
        </Fragment>
    )
}

export default Stations