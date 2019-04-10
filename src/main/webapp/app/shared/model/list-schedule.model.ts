import { Moment } from 'moment';
import { IProductList } from 'app/shared/model/product-list.model';
import { IListPurchase } from 'app/shared/model/list-purchase.model';

export interface IListSchedule {
    id?: number;
    day?: string;
    time?: Moment;
    state?: boolean;
    productList?: IProductList;
    recurrent?: boolean;
    purchaseid?: number;
}

export class ListSchedule implements IListSchedule {
    constructor(
        public id?: number,
        public day?: string,
        public time?: Moment,
        public state?: boolean,
        public productList?: IProductList,
        public recurrent?: boolean,
        public purchaseid?: number
    ) {
        this.state = this.state || false;
    }
}
