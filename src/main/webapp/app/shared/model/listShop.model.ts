import { IProduct } from 'app/shared/model/product.model';

export interface IListShop {
    price?: number;
    inventoryQty?: number;
    QtyBuy?: number;
    product?: IProduct;
}

export class ListShop implements IListShop {
    constructor(public price?: number, public inventoryQty?: number, public QtyBuy?: number, public product?: IProduct) {}
}
