import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import {stations} from "./stations";

/**
 * Models a trip contained in the database
 */
@Entity()
export class trips {
    @PrimaryGeneratedColumn({type: "int"})
    id: number
    @Column({type:'time without time zone'})
    departure_date: Date
    @Column({type:'time without time zone'})
    return_date: Date
    @Column({type:'real'})
    distance: number
    @Column({type:"int"})
    duration: number

    @ManyToOne(() => stations, (station) => station.outbound_trips)
    @JoinColumn({referencedColumnName:'id', name: 'departure_station', foreignKeyConstraintName: 'departure_station_fk'})
    departure_station: stations

    @ManyToOne(() => stations, (station) => station.inbound_trips)
    @JoinColumn({referencedColumnName:'id', name: 'return_station', foreignKeyConstraintName: 'return_station_fk'})
    return_station: stations
}