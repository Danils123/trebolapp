import { IUser } from 'app/core/user/user.model';
import { ICommerce } from 'app/shared/model/commerce.model';
import { IRankingPerOrder } from 'app/shared/model/ranking-per-order.model';

export interface IUserExtra {
    id?: number;
    secondLastName?: string;
    phone?: string;
    cellPhone?: string;
    address?: string;
    ranking?: string;
    photograph?: string;
    notification?: string;
    user?: IUser;
    commerces?: ICommerce[];
    orderBuyers?: IRankingPerOrder[];
    orderSellers?: IRankingPerOrder[];
}

export class UserExtra implements IUserExtra {
    constructor(
        public id?: number,
        public secondLastName?: string,
        public phone?: string,
        public cellPhone?: string,
        public address?: string,
        public ranking?: string,
        public photograph?: string,
        public notification?: string,
        public user?: IUser,
        public commerces?: ICommerce[],
        public orderBuyers?: IRankingPerOrder[],
        public orderSellers?: IRankingPerOrder[]
    ) {}
}
