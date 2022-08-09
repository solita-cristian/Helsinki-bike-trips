import {BaseParameters} from './base'

/**
 * Defines the possible query parameters that the route /stations can have
 */
export class TripParameters extends BaseParameters {
    public readonly departure?: number
    public readonly return?: number
    public readonly distance?: number
    public readonly duration?: number
    public readonly departureTime?: Date
    public readonly returnTime?: Date

    constructor(page?: number, perPage?: number, departure?: number, ret?: number, distance?: number, duration?: number,
        departureTime?: Date, returnTime?: Date) {
        super(page, perPage)
        this.departure = departure
        this.return = ret
        this.distance = distance ? distance * 1000 : undefined
        this.duration = duration ? duration * 60.0 : undefined
        this.departureTime = departureTime
        this.returnTime = returnTime
    }


}