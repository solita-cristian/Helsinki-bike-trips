import {stations} from "./stations";
import {trips} from "./trips";

interface IPage<T> {
    data: T[]
    perPage: number,
    page: number
}

export abstract class Page<T> implements IPage<T> {
    public data: T[];
    public page: number;
    public perPage: number;

    constructor(data: T[], page: number | string, perPage: number | string) {
        this.data = data;
        this.page = (typeof page === "string" ? parseInt(page) : page);
        this.perPage = (typeof perPage === "string" ? parseInt(perPage) : perPage);
    }
}

export class StationsPage extends Page<stations> {
}

export class TripsPage extends Page<trips> {
}