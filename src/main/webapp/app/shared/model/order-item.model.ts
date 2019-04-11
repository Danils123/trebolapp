import { Moment } from 'moment';
import { IProductsPerOrder } from 'app/shared/model/products-per-order.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { ICommerce } from 'app/shared/model/commerce.model';

export interface IOrderItem {
    id?: number;
    description?: string;
    date?: Moment;
    state?: number;
    productsPerOrders?: IProductsPerOrder[];
    seller?: IUserExtra;
    commerce?: ICommerce;
}

export class OrderItem implements IOrderItem {
    constructor(
        public id?: number,
        public description?: string,
        public date?: Moment,
        public state?: number,
        public productsPerOrders?: IProductsPerOrder[],
        public seller?: IUserExtra,
        public commerce?: ICommerce
    ) {}
}
