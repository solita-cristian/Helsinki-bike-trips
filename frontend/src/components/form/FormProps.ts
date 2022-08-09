import { Params } from "../../models/Params"

export interface FilterFormProps<T extends Params> {
    params: Partial<T>
    updateParams: (params: Partial<T>) => void,
    clearParams: () => void
}