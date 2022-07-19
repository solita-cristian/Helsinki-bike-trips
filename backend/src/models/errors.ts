export interface IError {
    id: string,
    title: string,
    status: number,
    detail: string,
    instance: string
}

export abstract class Error implements IError {
    public id: string;
    public title: string;
    public status: number;
    public detail: string;
    public instance: string;

    protected constructor(id: string, title: string, status: number, detail: string, instance: string) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.detail = detail;
        this.instance = instance;
    }

    build = () => {
        return {
            id: this.id,
            title: this.title,
            status: this.status,
            detail: this.detail,
            instance: this.instance
        };
    }
}

export class NotFoundError extends Error {
    constructor(title: string, detail: string, instance: string) {
        super('Not found', title, 404, detail, instance)
    }
}

export class BadParameterError extends Error {
    constructor(title: string, detail: string, instance: string) {
        super('Badly formatted parameter', title, 400, detail, instance)
    }
}