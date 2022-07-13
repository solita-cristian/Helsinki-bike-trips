import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import {Station} from "./station";

@Entity()
export class Trip {
    @PrimaryGeneratedColumn({type: "int"})
    id: number
    @Column({type:'time without time zone'})
    departure_time: Date
    @Column({type:'time without time zone'})
    return_time: Date
    @Column({type:'real'})
    distance: number
    @Column({type:"int"})
    duration: number

    @OneToOne(() => Station, (station) => station.id)
    @JoinColumn()
    departure_station: Station

    @OneToOne(() => Station, (station) => station.id)
    @JoinColumn()
    return_station: Station
}