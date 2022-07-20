import {stations} from "./stations";
import {trips} from "./trips";
import {AppDataSource} from "../database";

/**
 * Defines the statistics of a station, specifically:
 *
 * - Total number of trips starting from the station
 * - Total number of trips ending at the station
 * - The average distance of a trip starting from the station
 * - The average distance of a trip ending at the station
 * - Top 5 most popular return stations for trips starting from the station
 * - Top 5 most popular departure stations for journeys ending at the station
 */
export class StationStatistics {
    readonly averageDistanceInbound: number;
    readonly averageDistanceOutbound: number;
    topInbound: stations[];
    topOutbound: stations[];
    readonly totalInbound: number;
    readonly totalOutbound: number;

    private constructor(month: number | null, inboundTrips: trips[], outboundTrips: trips[]) {
        if (month) {
            let inb = inboundTrips.filter(t => t.departure_time.getMonth() + 1 === month);
            let outb = outboundTrips.filter(t => t.departure_time.getMonth() + 1 === month);

            this.averageDistanceInbound = this.getAverageDistance(inb);
            this.averageDistanceOutbound = this.getAverageDistance(outb);

            this.totalOutbound = outb.length;
            this.totalInbound = inb.length;
        } else {
            this.averageDistanceInbound = this.getAverageDistance(inboundTrips);
            this.averageDistanceOutbound = this.getAverageDistance(outboundTrips);

            this.totalInbound = inboundTrips.length;
            this.totalOutbound = outboundTrips.length;
        }
    }

    /**
     * Factory method to instantiate a StationStatistics object with the statistics by month.
     * @param station The station the statistics refer to
     * @param month The month taken into consideration for the calculation of the statistics. If `null`, calculate
     * the statistics using all the available data
     */
    static create = async (station: stations, month: number | null) => {
        let inboundTrips = await station.inbound_trips;
        let outboundTrips = await station.outbound_trips;

        let stats = new StationStatistics(month, inboundTrips, outboundTrips);
        await stats.setTopStations(month, station);

        return stats;
    }

    /**
     * Sets the top 5 inbound and outbound stations, using monthly statistics
     * @param month The month taken into The month taken into consideration for the calculation of the statistics. If `null`, calculate
     * the statistics using all the available data
     * @param station The station the statistics refer to
     */
    private setTopStations = async (month: number | null, station: stations) => {
        this.topInbound = await this.getTopStations(false, month, station.id);
        this.topOutbound = await this.getTopStations(true, month, station.id);
    }

    /**
     * Fetches the top 5 stations which start or finish at the requested station.
     *
     * @param outbound A boolean value indicating if the stations are the starting or ending point of the trip
     * @param month The month of the year. Used to filter the trips by month. If set to `null` will fetch all trips.
     * @param stationId The ID of the requested station
     */
    private getTopStations = async (outbound: boolean, month: number | null, stationId: number) => {
        const station = (outbound ? 'return' : 'departure') + '_station';
        const opp_station = (outbound ? 'departure' : 'return') + '_station';
        const trips_repository = AppDataSource.getRepository('trips')

        return (await trips_repository
            .createQueryBuilder('getTopStations')
            .select(`${station}, COUNT(*) as total`)
            .where(`${month ? `extract(MONTH from departure_time) = :month and` : ''} ${opp_station} = :stationId`,
                month ? {month: month, stationId: stationId} : {stationId: stationId})
            .groupBy(`${station}`)
            .orderBy('total', 'DESC')
            .cache(true)
            .getRawMany<stations>()).slice(0, 5);
    }

    /**
     * Returns the average distance of the trips.
     * @param trips A list of trips
     */
    private getAverageDistance = (trips: trips[]) => {
        const sumDistances = (accumulatedTotal: number, currentDistance: number) => {
            return accumulatedTotal + currentDistance;
        }

        return parseFloat((trips
            .map(t => t.distance)
            .reduce(sumDistances, 0) / trips.length)
            .toFixed(2))
    }
}