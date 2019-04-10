import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductService } from 'app/entities/product';
import { IProduct } from 'app/shared/model/product.model';

@Component({
    selector: 'jhi-product-commerce-detail',
    templateUrl: './product-commerce-detail.component.html'
})
export class ProductCommerceDetailComponent implements OnInit {
    productCommerce: IProductCommerce;
    products: IProduct[];

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected productService: ProductService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productCommerce }) => {
            this.productCommerce = productCommerce;
        });
        this.productService
            .query()
            .pipe(
                filter((res: HttpResponse<IProduct[]>) => res.ok),
                map((res: HttpResponse<IProduct[]>) => res.body)
            )
            .subscribe(
                (res: IProduct[]) => {
                    this.products = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
