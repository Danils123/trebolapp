import { ICategory } from 'app/shared/model/category.model';
import { ISubCategory } from 'app/shared/model/sub-category.model';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';

export interface IProduct {
    id?: number;
    barCode?: string;
    name?: string;
    brand?: string;
    description?: string;
    image?: string;
    category?: ICategory;
    subCategory?: ISubCategory;
    productCommerces?: IProductCommerce[];
    disabled?: boolean;
}

export class Product implements IProduct {
    constructor(
        public id?: number,
        public barCode?: string,
        public name?: string,
        public brand?: string,
        public description?: string,
        public image?: string,
        public category?: ICategory,
        public subCategory?: ISubCategory,
        public productCommerces?: IProductCommerce[],
        public disabled?: boolean
    ) {}
}
