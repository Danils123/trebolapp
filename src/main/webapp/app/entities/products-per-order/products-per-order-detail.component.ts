import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductsPerOrder } from 'app/shared/model/products-per-order.model';

@Component({
    selector: 'jhi-products-per-order-detail',
    templateUrl: './products-per-order-detail.component.html'
})
export class ProductsPerOrderDetailComponent implements OnInit {
    productsPerOrder: IProductsPerOrder;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productsPerOrder }) => {
            this.productsPerOrder = productsPerOrder;
        });
    }

    previousState() {
        window.history.back();
    }
}
