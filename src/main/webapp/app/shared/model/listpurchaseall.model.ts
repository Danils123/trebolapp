import { ListPurchase } from 'app/shared/model/list-purchase.model';
import { ProductList } from 'app/shared/model/product-list.model';

export interface Ilistpurchaseall {
    listpurchase?: ListPurchase;
    productlist?: ProductList[];
}

export class ListPurchaseAll implements Ilistpurchaseall {
    constructor(public listpurchase: ListPurchase, public productlist: ProductList[]) {}
}
