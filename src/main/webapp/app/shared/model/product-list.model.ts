import { IListSchedule } from 'app/shared/model/list-schedule.model';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';

export interface IProductList {
    id?: number;
    state?: boolean;
    listSchedules?: IListSchedule[];
    productCommerces?: IProductCommerce[];
}

export class ProductList implements IProductList {
    constructor(
        public id?: number,
        public state?: boolean,
        public listSchedules?: IListSchedule[],
        public productCommerces?: IProductCommerce[]
    ) {
        this.state = this.state || false;
    }
}
