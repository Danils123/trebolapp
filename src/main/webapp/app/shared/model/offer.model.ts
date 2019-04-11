import { Moment } from 'moment';
import { ICommerce } from './commerce.model';

export interface IOffer {
    id?: number;
    discount?: number;
    description?: string;
    type?: number;
    expirationDate?: Moment;
    disabled?: boolean;
    commerces?: ICommerce[];
}

export class Offer implements IOffer {
    constructor(
        public id?: number,
        public discount?: number,
        public description?: string,
        public type?: number,
        public expirationDate?: Moment,
        public disabled?: boolean,
        public commerces?: ICommerce[]
    ) {
        this.disabled = this.disabled || false;
    }
}
