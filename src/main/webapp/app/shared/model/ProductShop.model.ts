import { Markerplace } from 'app/shared/model/markerplace.model';
import { ICommerce } from 'app/shared/model/commerce.model';
import { IListShop } from 'app/shared/model/listShop.model';

export interface IProductShop {
    user?: Markerplace;
    commerce?: ICommerce;
    listShop?: IListShop[];
}

export class ProductShop implements IProductShop {
    constructor(public user?: Markerplace, public commerce?: ICommerce, public listShop?: IListShop[]) {}
}
