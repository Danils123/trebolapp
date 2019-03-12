import { IProduct } from 'app/shared/model/product.model';
import { ICommerce } from 'app/shared/model/commerce.model';
import { IProductList } from 'app/shared/model/product-list.model';

export interface IProductCommerce {
    id?: number;
    price?: number;
    quantity?: number;
    product?: IProduct;
    commerce?: ICommerce[];
    productLists?: IProductList[];
}

export class ProductCommerce implements IProductCommerce {
    constructor(
        public id?: number,
        public price?: number,
        public quantity?: number,
        public product?: IProduct,
        public commerce?: ICommerce[],
        public productLists?: IProductList[]
    ) {}
}
