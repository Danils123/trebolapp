import { Moment } from 'moment';

export interface IOffer {
    id?: number;
    discount?: number;
    description?: string;
    type?: number;
    expirationDate?: Moment;
    disabled?: boolean;
}

export class Offer implements IOffer {
    constructor(
        public id?: number,
        public discount?: number,
        public description?: string,
        public type?: number,
        public expirationDate?: Moment,
        public disabled?: boolean
    ) {
        this.disabled = this.disabled || false;
    }
}
