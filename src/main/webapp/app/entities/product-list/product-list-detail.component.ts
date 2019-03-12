import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductList } from 'app/shared/model/product-list.model';

@Component({
    selector: 'jhi-product-list-detail',
    templateUrl: './product-list-detail.component.html'
})
export class ProductListDetailComponent implements OnInit {
    productList: IProductList;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productList }) => {
            this.productList = productList;
        });
    }

    previousState() {
        window.history.back();
    }
}
