import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { IOffer } from 'app/shared/model/offer.model';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { IParametersCommerce } from 'app/shared/model/parameters-commerce.model';
import { IScheduleCommerce } from 'app/shared/model/schedule-commerce.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';

export interface ICommerce {
    id?: number;
    identification?: number;
    name?: string;
    address?: string;
    latitude?: number;
    longitud?: number;
    email?: string;
    ranking?: number;
    photograph?: string;
    state?: boolean;
    phone?: string;
    productCommerce?: IProductCommerce;
    offer?: IOffer;
    orderItems?: IOrderItem[];
    parametersCommerces?: IParametersCommerce[];
    scheduleCommerces?: IScheduleCommerce[];
    owner?: IUserExtra;
    userExtra?: IUserExtra;
}

export class Commerce implements ICommerce {
    constructor(
        public id?: number,
        public identification?: number,
        public name?: string,
        public address?: string,
        public latitude?: number,
        public longitud?: number,
        public email?: string,
        public ranking?: number,
        public photograph?: string,
        public state?: boolean,
        public phone?: string,
        public productCommerce?: IProductCommerce,
        public offer?: IOffer,
        public orderItems?: IOrderItem[],
        public parametersCommerces?: IParametersCommerce[],
        public scheduleCommerces?: IScheduleCommerce[],
        public owner?: IUserExtra,
        public userExtra?: IUserExtra
    ) {
        this.state = this.state || false;
    }
}
