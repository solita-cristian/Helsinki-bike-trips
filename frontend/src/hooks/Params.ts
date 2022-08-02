/* eslint-disable react-hooks/exhaustive-deps */
import { Reducer, useMemo, useReducer, useState } from "react";
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
            console.log(updatedParams)
            Object.keys(updatedParams).forEach(
                key => {
                    const v = updatedParams[key as keyof typeof updatedParams];
                    if (v === undefined)
                        delete updatedParams[key as keyof typeof updatedParams];
                    else if(Array.isArray(v) && v.includes(undefined)) {
                        if(v[0] === undefined) v[0] = ''
                        else if(v[1] === undefined) v[1] = ''
                    }
                })
                console.log(updatedParams)
            debouncedSetParams(updatedParams)
        },
        clearParams: () => {
            dispatch({type: 'reset', payload: initialParams})
        }
    }

}

export default useParams