import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {stations} from "./stations";

/**
 * Models a trip contained in the database
 */
@Entity()
export class trips {
    @PrimaryGeneratedColumn({type: "int"})
    id: number
    @Column({type: 'timestamp'})
    departure_time: Date
    @Column({type: 'timestamp'})
    return_time: Date
    @Column({type: 'real'})
    distance: number
    @Column({type: "int"})
    duration: number

    @ManyToOne(() => stations, (station) => station.outbound_trips)
    @JoinColumn({name: "departure_station", referencedColumnName: 'id'})
    departure_station: stations

    @ManyToOne(() => stations, (station) => station.inbound_trips)
    @JoinColumn({name: "return_station", referencedColumnName: 'id'})
    return_station: stations
}