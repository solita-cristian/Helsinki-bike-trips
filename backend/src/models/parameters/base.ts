/**
 * Defines the minimum pagination parameters
 */
export abstract class BaseParameters {
    page?: number;
    perPage?: number;

    protected constructor(page?: number, perPage?: number) {
        this.page = page;
        this.perPage = perPage;
    }

}