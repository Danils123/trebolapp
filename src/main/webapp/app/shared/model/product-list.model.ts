import { IListSchedule } from 'app/shared/model/list-schedule.model';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';

export interface IProductList {
    id?: number;
    name?: string;
    brand?: string;
    quantity?: number;
    idlistpurchase?: number;
    state?: boolean;
    listSchedules?: IListSchedule[];
    productCommerces?: IProductCommerce[];
}

export class ProductList implements IProductList {
    constructor(
        public id?: number,
        public name?: string,
        public brand?: string,
        public quantity?: number,
        public idlistpurchase?: number,
        public state?: boolean,
        public listSchedules?: IListSchedule[],
        public productCommerces?: IProductCommerce[]
    ) {
        this.state = this.state || false;
    }
}
