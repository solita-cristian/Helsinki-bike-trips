/* eslint-disable react-hooks/exhaustive-deps */
import { Reducer, useMemo, useReducer } from "react";
import debounce from 'lodash.debounce'

interface Action<D> {
    type: string,
    payload: Partial<D>
}

function useParams<D>(initialParams: D, debounceWait = 100) {

    const reducer = (state: Partial<D>, action: Action<D>) => {
        switch(action.type) {
            case 'reset':
                return action.payload
            case 'update':
                return {...state, ...action.payload}
            default:
                return state
        }
    }

    const [params, dispatch] = useReducer<Reducer<Partial<D>, Action<D>>>(reducer, initialParams)

    const debouncedSetParams = useMemo(() => 
        debounce((newParams: Partial<D>) => {
            dispatch({type: 'update', payload: newParams})
        }, debounceWait),
        []
    )

    return {
        params,
        debouncedUpdateParams: (updatedParams: Partial<D>) => {
            debouncedSetParams(updatedParams)
        },
        clearParams: () => {
            dispatch({type: 'reset', payload: initialParams})
        }
    }

}

export default useParams