import { Moment } from 'moment';
import { ICommerce } from 'app/shared/model/commerce.model';

export interface IScheduleCommerce {
    id?: number;
    day?: string;
    openTime?: Moment;
    closingtime?: Moment;
    commerce?: ICommerce;
}

export class ScheduleCommerce implements IScheduleCommerce {
    constructor(
        public id?: number,
        public day?: string,
        public openTime?: Moment,
        public closingtime?: Moment,
        public commerce?: ICommerce
    ) {}
}
