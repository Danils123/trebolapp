import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IListPurchase } from 'app/shared/model/list-purchase.model';
import { AccountService } from 'app/core';
import { ListPurchaseService } from './list-purchase.service';

@Component({
    selector: 'jhi-list-purchase',
    templateUrl: './list-purchase.component.html'
})
export class ListPurchaseComponent implements OnInit, OnDestroy {
    listPurchases: IListPurchase[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected listPurchaseService: ListPurchaseService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.listPurchaseService
            .query()
            .pipe(
                filter((res: HttpResponse<IListPurchase[]>) => res.ok),
                map((res: HttpResponse<IListPurchase[]>) => res.body)
            )
            .subscribe(
                (res: IListPurchase[]) => {
                    this.listPurchases = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInListPurchases();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IListPurchase) {
        return item.id;
    }

    registerChangeInListPurchases() {
        this.eventSubscriber = this.eventManager.subscribe('listPurchaseListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
