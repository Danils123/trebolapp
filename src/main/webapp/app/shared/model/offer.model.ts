import { IOrderItem } from 'app/shared/model/order-item.model';

export interface IOffer {
    id?: number;
    discount?: number;
    description?: string;
    type?: number;
    orderItems?: IOrderItem[];
}

export class Offer implements IOffer {
    constructor(
        public id?: number,
        public discount?: number,
        public description?: string,
        public type?: number,
        public orderItems?: IOrderItem[]
    ) {}
}