import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {Trip} from "./trip";

/**
 * Models a station contained in the database
 */
@Entity()
export class Station {
    @PrimaryGeneratedColumn({type:"int"})
    fid: number
    @Column({type:"int"})
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
}