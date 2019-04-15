export interface IDeliveryMap {
    id?: number;
}

export class DeliveryMap implements IDeliveryMap {
    constructor(public id?: number) {}
}
