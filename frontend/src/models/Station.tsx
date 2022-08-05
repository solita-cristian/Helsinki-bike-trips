export type Station = {
    id: number,
    name_fi: string,
    name_se: string,
    name_en: string,
    address_fi: string,
    address_se: string,
    city_fi?: string,
    city_se?: string,
    operator?: string,
    capacity: number,
    x: number,
    y: number
}