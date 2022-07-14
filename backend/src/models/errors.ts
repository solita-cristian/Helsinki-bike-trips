export interface Error {
    id: string,
    title: string,
    status: number,
    detail: string,
    instance: string
}

export const buildError = (id: string, title: string, status: number, detail: string, url: string) => {
    const error: Error = {
        id: id,
        title: title,
        status: status,
        detail: detail,
        instance: url
    };
    return error;
}