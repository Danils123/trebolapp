import { Moment } from 'moment';
import { IProductsPerOrder } from 'app/shared/model/products-per-order.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { ICommerce } from 'app/shared/model/commerce.model';
import { IOffer } from 'app/shared/model/offer.model';

export interface IOrderItem {
    id?: number;
    description?: string;
    date?: Moment;
    total?: number;
    discount?: number;
    points?: number;
    productsPerOrders?: IProductsPerOrder[];
    seller?: IUserExtra;
    commerce?: ICommerce;
    offer?: IOffer;
}

export class OrderItem implements IOrderItem {
    constructor(
        public id?: number,
        public description?: string,
        public date?: Moment,
        public total?: number,
        public discount?: number,
        public points?: number,
        public productsPerOrders?: IProductsPerOrder[],
        public seller?: IUserExtra,
        public commerce?: ICommerce,
        public offer?: IOffer
    ) {}
}
