import { Moment } from 'moment';
import { IProductList } from 'app/shared/model/product-list.model';

export interface IListSchedule {
    id?: number;
    day?: string;
    time?: Moment;
    state?: boolean;
    productList?: IProductList;
}

export class ListSchedule implements IListSchedule {
    constructor(public id?: number, public day?: string, public time?: Moment, public state?: boolean, public productList?: IProductList) {
        this.state = this.state || false;
    }
}
