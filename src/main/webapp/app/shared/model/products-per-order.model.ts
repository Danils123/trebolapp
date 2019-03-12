import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { IOrderItem } from 'app/shared/model/order-item.model';

export interface IProductsPerOrder {
    id?: number;
    quantity?: number;
    productCommerce?: IProductCommerce;
    orderItem?: IOrderItem;
}

export class ProductsPerOrder implements IProductsPerOrder {
    constructor(public id?: number, public quantity?: number, public productCommerce?: IProductCommerce, public orderItem?: IOrderItem) {}
}
