import { IUserExtra } from 'app/shared/model/user-extra.model';

export interface IRankingPerOrder {
    id?: number;
    commentFromBuyer?: string;
    commentFromSeller?: string;
    ranking?: number;
    buyers?: IUserExtra[];
    sellers?: IUserExtra[];
}

export class RankingPerOrder implements IRankingPerOrder {
    constructor(
        public id?: number,
        public commentFromBuyer?: string,
        public commentFromSeller?: string,
        public ranking?: number,
        public buyers?: IUserExtra[],
        public sellers?: IUserExtra[]
    ) {}
}
