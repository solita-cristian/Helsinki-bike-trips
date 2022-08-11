import { Params } from "../../models/Params"

/**
 * Defines generic props for a filtering form component
 */
export interface FilterFormProps<T extends Params> {
    params: Partial<T>
    updateParams: (params: Partial<T>) => void,
    clearParams: () => void
}