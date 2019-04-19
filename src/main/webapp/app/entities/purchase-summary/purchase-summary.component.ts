import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPurchaseSummary } from 'app/shared/model/purchase-summary.model';
import { AccountService } from 'app/core';
import { PurchaseSummaryService } from './purchase-summary.service';

@Component({
    selector: 'jhi-purchase-summary',
    templateUrl: './purchase-summary.component.html'
})
export class PurchaseSummaryComponent implements OnInit, OnDestroy {
    purchaseSummaries: IPurchaseSummary[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected purchaseSummaryService: PurchaseSummaryService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.purchaseSummaryService
            .query()
            .pipe(
                filter((res: HttpResponse<IPurchaseSummary[]>) => res.ok),
                map((res: HttpResponse<IPurchaseSummary[]>) => res.body)
            )
            .subscribe(
                (res: IPurchaseSummary[]) => {
                    this.purchaseSummaries = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPurchaseSummaries();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPurchaseSummary) {
        return item.id;
    }

    registerChangeInPurchaseSummaries() {
        this.eventSubscriber = this.eventManager.subscribe('purchaseSummaryListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
