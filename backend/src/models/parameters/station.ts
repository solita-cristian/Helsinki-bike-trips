/**
 * Defines the only accepted languages of a station's name when retrieving stations
 */
import {BaseParameters} from './base'

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
    SE = 'se'
}

/**
 * Defines the possible query parameters that the route /stations can have
 */
export interface StationParameters extends BaseParameters {
    city?: [string, string];
    name?: [string, string];
    address?: [string, string];
    operator?: string;
    capacity?: number;
}

export interface StatisticsParameters extends BaseParameters {
    month?: number
}