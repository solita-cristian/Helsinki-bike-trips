export enum NameLanguage {
    FI = 'fi',
    SE = 'se',
    EN = 'en'
}


export enum AddressLanguage {
    FI = 'fi',
    SE = "se"
}

export interface StationParameters {
    city?: [string, AddressLanguage],
    name?: [string, NameLanguage],
    address?: [string, AddressLanguage],
    operator?: string,
    capacity?: number,
    page?: number,
    perPage?: number
}