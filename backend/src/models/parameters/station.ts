/**
 * Defines the only accepted languages of a station's name when retrieving stations
 */
import {BaseParameters} from "./base";

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
export class StationParameters extends BaseParameters {
    public city?: [string, AddressLanguage];
    public name?: [string, NameLanguage];
    public address?: [string, AddressLanguage];
    public operator?: string;
    public capacity?: number;

    constructor(page?: number, perPage?: number, city?: [string, AddressLanguage], name?: [string, NameLanguage],
                address?: [string, AddressLanguage], operator?: string, capacity?: number) {
        super(page, perPage);
        this.capacity = capacity;
        this.city = city;
        this.address = address;
        this.name = name;
        this.operator = operator;
    }


}