import { IProductList } from 'app/shared/model/product-list.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';

export interface IListPurchase {
    id?: number;
    name?: string;
    description?: string;
    state?: boolean;
    productList?: IProductList;
    seller?: IUserExtra;
}

export class ListPurchase implements IListPurchase {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public state?: boolean,
        public productList?: IProductList,
        public seller?: IUserExtra
    ) {
        this.state = this.state || false;
    }
}
