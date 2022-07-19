export enum CityLanguage {
    FI = 'fi',
    SE = 'se',
    EN = 'en'
}

export enum AddressLanguage {
    Fi = 'fi',
    SE = "se"
}

export interface StationParameters {
    city?: [string, CityLanguage],
    name?: [string, CityLanguage],
    address?: [string, AddressLanguage],
    operator?: string,
    capacity?: number,
    page?: number,
    perPage?: number
}