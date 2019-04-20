import { Injectable, Output, EventEmitter } from '@angular/core';
import { ProductShop } from 'app/shared/model/ProductShop.model';

@Injectable({
    providedIn: 'root'
})
export class MapshopService {
    information: ProductShop;
    idList: number;
    @Output() informationEmitter: EventEmitter<ProductShop> = new EventEmitter();
    @Output() idListEmitter: EventEmitter<number> = new EventEmitter();
    constructor() {}

    sendInformation(information: ProductShop) {
        this.information = information;
        this.informationEmitter.emit(this.information);
    }

    enterIdList(idList: number) {
        this.idList = idList;
        this.idListEmitter.emit(this.idList);
    }
}
