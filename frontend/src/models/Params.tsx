export interface Params {
    page: number,
    perPage: number
}

export interface StationsParams extends Params {
    name?: string,
    address?: string,
    city?: string,
    operator?: string,
    capacity?: number
}