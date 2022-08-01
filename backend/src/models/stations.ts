import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {trips} from './trips'

/**
 * Models a station contained in the database
 */
@Entity()
export class stations {
    @PrimaryGeneratedColumn({type: 'int'})
        id: number
    @Column({type: 'varchar', length: 50})
        name_fi: string
    @Column({type: 'varchar', length: 50})
        name_se: string
    @Column({type: 'varchar', length: 50})
        name_en: string
    @Column({type: 'varchar', length: 50})
        address_fi: string
    @Column({type: 'varchar', length: 50})
        address_se: string
    @Column({type: 'varchar', nullable: true, length: 20})
        city_fi: string | undefined
    @Column({type: 'varchar', nullable: true, length: 20})
        city_se: string | undefined
    @Column({type: 'varchar', nullable: true, length: 20})
        operator: string | undefined
    @Column({type: 'int', nullable: true})
        capacity: number | undefined
    @Column({type: 'real'})
        x: number
    @Column({type: 'real'})
        y: number

    /**
     * Models a one-to-many relationship with inbound trips.
     * An inbound trip is a trip whose destination is this station
     */
    @OneToMany(() => trips, (trip) => trip.return_station)
        inbound_trips: Promise<trips[]>

    /**
     * Models a one-to-many relationship with outbound trips.
     * An outbound trip is a trip whose start is this station
     */
    @OneToMany(() => trips, (trip) => trip.departure_station)
        outbound_trips: Promise<trips[]>
}