/**
 * Defines the only accepted languages of a station's name when retrieving stations
 */
export enum NameLanguage {
    FI = 'fi',
    SE = 'se',
    EN = 'en'
}

/**
 * Defines the only accepted languages of a station's address and city name when retrieving stations
 */
export enum AddressLanguage {
    FI = 'fi',
    SE = "se"
}

/**
 * Defines the possible query parameters that the route /stations can have
 */
export interface StationParameters {
    city?: [string, AddressLanguage],
    name?: [string, NameLanguage],
    address?: [string, AddressLanguage],
    operator?: string,
    capacity?: number,
    page?: number,
    perPage?: number
}