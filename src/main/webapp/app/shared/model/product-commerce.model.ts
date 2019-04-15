import { IProduct } from 'app/shared/model/product.model';
import { IProductList } from 'app/shared/model/product-list.model';

export interface IProductCommerce {
    id?: number;
    price?: number;
    quantity?: number;
    commerce_id?: number;
    product?: IProduct;
    productLists?: IProductList[];
}

export class ProductCommerce implements IProductCommerce {
    constructor(
        public id?: number,
        public price?: number,
        public quantity?: number,
        public commerce_id?: number,
        public product?: IProduct,
        public productLists?: IProductList[]
    ) {}
}
