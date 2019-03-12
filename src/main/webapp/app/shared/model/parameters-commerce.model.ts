import { ICommerce } from 'app/shared/model/commerce.model';

export interface IParametersCommerce {
    id?: number;
    key?: string;
    value?: string;
    state?: boolean;
    commerce?: ICommerce;
}

export class ParametersCommerce implements IParametersCommerce {
    constructor(public id?: number, public key?: string, public value?: string, public state?: boolean, public commerce?: ICommerce) {
        this.state = this.state || false;
    }
}
