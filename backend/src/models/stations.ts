import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {trips} from "./trips";

/**
 * Models a station contained in the database
 */
@Entity()
export class stations {
    @PrimaryGeneratedColumn({type:"int"})
    fid: number
    @Column({type:"int", unique: true})
    id: number
    @Column({type:"varchar"})
    name_fi: string
    @Column({type:"varchar"})
    name_se: string
    @Column({type:"varchar"})
    name_en: string
    @Column({type:"varchar"})
    address_fi: string
    @Column({type:"varchar"})
    address_se: string
    @Column({type:"varchar", nullable:true})
    city_fi: string | undefined
    @Column({type:"varchar", nullable:true})
    city_se: string | undefined
    @Column({type:"varchar", nullable:true})
    operator: string | undefined
    @Column({type:"varchar", nullable:true})
    capacity: number | undefined
    @Column({type: "real"})
    x: number
    @Column({type:"real"})
    y: number

    /**
     * Models a one-to-many relationship with inbound trips.
     * An inbound trip is a trip whose destination is this station
     */
    @OneToMany(() => trips, (trip) => trip.return_station)
    inbound_trips: trips[]

    /**
     * Models a one-to-many relationship with outbound trips.
     * An outbound trip is a trip whose start is this station
     */
    @OneToMany(() => trips, (trip) => trip.departure_station)
    outbound_trips: trips[]
}