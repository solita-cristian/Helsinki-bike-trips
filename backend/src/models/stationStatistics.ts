import {stations} from "./stations";
import {trips} from "./trips";
import {AppDataSource} from "../database";


export class StationStatistics {
    averageDistanceInbound: number;
    averageDistanceOutbound: number;
    topInbound: stations[];
    topOutbound: stations[];
    totalInbound: number;
    totalOutbound: number;


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

    private constructor(month: number | null, inboundTrips: trips[], outboundTrips: trips[]) {

        if (month) {
            let inb = inboundTrips.filter(t => t.departure_time.getMonth() + 1 === month);
            let outb = outboundTrips.filter(t => t.departure_time.getMonth() + 1 === month);

            this.averageDistanceInbound = this.getAverageDistance(inb);
            this.averageDistanceOutbound = this.getAverageDistance(outb);

            this.totalOutbound = outb.length;
            this.totalInbound = inb.length;
        }
        else {
            this.averageDistanceInbound = this.getAverageDistance(inboundTrips);
            this.averageDistanceOutbound = this.getAverageDistance(outboundTrips);

            this.totalInbound = inboundTrips.length;
            this.totalOutbound = outboundTrips.length;
        }

    }


    static create = async (station: stations, month: number | null) => {
        let inboundTrips = await station.inbound_trips;
        let outboundTrips = await station.outbound_trips;

        let stats = new StationStatistics(month, inboundTrips, outboundTrips);
        stats.topInbound = await stats.getTopStations(false, month, station.id);
        stats.topOutbound = await stats.getTopStations(true, month, station.id);

        return stats;

    }
}