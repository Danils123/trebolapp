import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { AccountService } from 'app/core';
import { ProductCommerceService } from './product-commerce.service';

@Component({
    selector: 'jhi-product-commerce',
    templateUrl: './product-commerce.component.html'
})
export class ProductCommerceComponent implements OnInit, OnDestroy {
    productCommerces: IProductCommerce[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected productCommerceService: ProductCommerceService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.productCommerceService
            .query()
            .pipe(
                filter((res: HttpResponse<IProductCommerce[]>) => res.ok),
                map((res: HttpResponse<IProductCommerce[]>) => res.body)
            )
            .subscribe(
                (res: IProductCommerce[]) => {
                    this.productCommerces = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInProductCommerces();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IProductCommerce) {
        return item.id;
    }

    registerChangeInProductCommerces() {
        this.eventSubscriber = this.eventManager.subscribe('productCommerceListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
