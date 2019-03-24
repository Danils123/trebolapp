import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProductList } from 'app/shared/model/product-list.model';
import { AccountService } from 'app/core';
import { ProductListService } from './product-list.service';

@Component({
    selector: 'jhi-product-list',
    templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, OnDestroy {
    productLists: IProductList[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected productListService: ProductListService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.productListService
            .query()
            .pipe(
                filter((res: HttpResponse<IProductList[]>) => res.ok),
                map((res: HttpResponse<IProductList[]>) => res.body)
            )
            .subscribe(
                (res: IProductList[]) => {
                    this.productLists = res;
                    console.log(this.productLists);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInProductLists();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IProductList) {
        return item.id;
    }

    registerChangeInProductLists() {
        this.eventSubscriber = this.eventManager.subscribe('productListListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
