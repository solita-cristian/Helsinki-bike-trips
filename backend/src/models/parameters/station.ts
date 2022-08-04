/**
 * Defines the only accepted languages of a station's name when retrieving stations
 */
import {BaseParameters} from './base'

/**
 * Defines the possible query parameters that the route /stations can have
 */
export interface StationParameters extends BaseParameters {
    city?: string;
    name?: string;
    address?: string;
    operator?: string;
    capacity?: number;
}

export interface StatisticsParameters extends BaseParameters {
    month?: number
}