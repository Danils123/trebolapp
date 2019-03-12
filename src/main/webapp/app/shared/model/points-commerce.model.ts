import { ICommerce } from 'app/shared/model/commerce.model';

export interface IPointsCommerce {
    id?: number;
    points?: number;
    commerce?: ICommerce;
}

export class PointsCommerce implements IPointsCommerce {
    constructor(public id?: number, public points?: number, public commerce?: ICommerce) {}
}
