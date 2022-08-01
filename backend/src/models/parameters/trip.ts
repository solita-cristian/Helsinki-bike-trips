import {BaseParameters} from './base'

/**
 * Defines the possible query parameters that the route /stations can have
 */
export class TripParameters extends BaseParameters {
    public departure?: number
    public return?: number
    public distance?: number
    public duration?: number

    constructor(page?: number, perPage?: number, departure?: number, ret?: number, distance?: number, duration?: number) {
        super(page, perPage)
        this.departure = departure
        this.return = ret
        this.distance = distance ? distance * 1000 : undefined
        this.duration = duration ? duration * 60.0 : undefined
    }


}