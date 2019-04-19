export interface IPurchase {
    id?: number;
    state?: string;
    homeDelivery?: boolean;
    paymentId?: number;
    orderId?: number;
}

export class Purchase implements IPurchase {
    constructor(
        public id?: number,
        public state?: string,
        public homeDelivery?: boolean,
        public paymentId?: number,
        public orderId?: number
    ) {
        this.homeDelivery = this.homeDelivery || false;
    }
}
