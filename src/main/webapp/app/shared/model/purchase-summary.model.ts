export interface IPurchaseSummary {
    id?: number;
    total?: string;
}

export class PurchaseSummary implements IPurchaseSummary {
    constructor(public id?: number, public total?: string) {}
}
