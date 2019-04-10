export interface ICommerceUser {
    id?: number;
    idCommerce?: number;
    idUser?: number;
}

export class CommerceUser implements ICommerceUser {
    constructor(public id?: number, public idCommerce?: number, public idUser?: number) {}
}
