
import { Fragment } from 'react'
import useApi from '../../hooks/Api'
import useParams from '../../hooks/Params'
import { StationPage } from '../../models/Stations'
import StationsTable from './StationsTable'
import './Stations.scss'


function Stations() {
    
    const {params, debouncedUpdateParams} = useParams( {
        page: 1,
        perPage: 10
    })
    const {response, error, isLoading} = useApi<StationPage>({
        baseURL: 'http://localhost:8080/stations',
        params: params
    })

    console.log(response, error, isLoading)

    if(error && !response) {
        return (
            <Fragment>
                <p>{error.message}</p>
            </Fragment>
        )
    }

    return (
        <StationsTable stations={response?.data} params={params} updateParams={debouncedUpdateParams}></StationsTable>
    )
}

export default Stations