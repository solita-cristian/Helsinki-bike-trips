/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useReducer, useState } from "react";
import debounce from 'lodash.debounce'



function useParams<D>(initialParams: D, debounceWait = 100) {
    const [params, setParams] = useReducer(
        (state: D, newState: Partial<D>) => ({
            ...state,
            ...newState,
          }),initialParams)
    const [isStale, setIsStale] = useState(false)

    const debouncedSetParams = useMemo(() => 
        debounce((newParams: Partial<D>) => {
            setIsStale(false)
            setParams(newParams)
        }, debounceWait),
        []
    )

    return {
        params,
        isStale,
        debouncedUpdateParams: (updatedParams: Partial<D>) => {
            setIsStale(true)
            debouncedSetParams(updatedParams)
        }
    }

}

export default useParams