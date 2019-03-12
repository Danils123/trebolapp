import { IProduct } from 'app/shared/model/product.model';

export interface ISubCategory {
    id?: number;
    name?: string;
    description?: string;
    products?: IProduct[];
}

export class SubCategory implements ISubCategory {
    constructor(public id?: number, public name?: string, public description?: string, public products?: IProduct[]) {}
}
