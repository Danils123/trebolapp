import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IListPurchase } from 'app/shared/model/list-purchase.model';

@Component({
    selector: 'jhi-list-purchase-detail',
    templateUrl: './list-purchase-detail.component.html'
})
export class ListPurchaseDetailComponent implements OnInit {
    listPurchase: IListPurchase;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ listPurchase }) => {
            this.listPurchase = listPurchase;
        });
    }

    previousState() {
        window.history.back();
    }
}
