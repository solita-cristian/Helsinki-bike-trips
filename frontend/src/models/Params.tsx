export interface Params {
    page: number,
    perPage: number
}

export interface StationsParams extends Params {
    name?: [string | undefined, string | undefined],
    address?: [string | undefined, string | undefined],
    city?: [string | undefined, string | undefined],
    operator?: string,
    capacity?: number
}