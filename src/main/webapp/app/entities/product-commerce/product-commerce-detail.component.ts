import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductCommerce } from 'app/shared/model/product-commerce.model';

@Component({
    selector: 'jhi-product-commerce-detail',
    templateUrl: './product-commerce-detail.component.html'
})
export class ProductCommerceDetailComponent implements OnInit {
    productCommerce: IProductCommerce;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productCommerce }) => {
            this.productCommerce = productCommerce;
        });
    }

    previousState() {
        window.history.back();
    }
}
