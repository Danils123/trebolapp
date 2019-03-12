import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductsPerOrder } from 'app/shared/model/products-per-order.model';
import { AccountService } from 'app/core';
import { ProductsPerOrderService } from './products-per-order.service';

@Component({
    selector: 'jhi-products-per-order',
    templateUrl: './products-per-order.component.html'
})
export class ProductsPerOrderComponent implements OnInit, OnDestroy {
    productsPerOrders: IProductsPerOrder[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected productsPerOrderService: ProductsPerOrderService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.productsPerOrderService
            .query()
            .pipe(
                filter((res: HttpResponse<IProductsPerOrder[]>) => res.ok),
                map((res: HttpResponse<IProductsPerOrder[]>) => res.body)
            )
            .subscribe(
                (res: IProductsPerOrder[]) => {
                    this.productsPerOrders = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInProductsPerOrders();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IProductsPerOrder) {
        return item.id;
    }

    registerChangeInProductsPerOrders() {
        this.eventSubscriber = this.eventManager.subscribe('productsPerOrderListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
