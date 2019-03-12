import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IRankingPerOrder } from 'app/shared/model/ranking-per-order.model';
import { AccountService } from 'app/core';
import { RankingPerOrderService } from './ranking-per-order.service';

@Component({
    selector: 'jhi-ranking-per-order',
    templateUrl: './ranking-per-order.component.html'
})
export class RankingPerOrderComponent implements OnInit, OnDestroy {
    rankingPerOrders: IRankingPerOrder[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected rankingPerOrderService: RankingPerOrderService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.rankingPerOrderService
            .query()
            .pipe(
                filter((res: HttpResponse<IRankingPerOrder[]>) => res.ok),
                map((res: HttpResponse<IRankingPerOrder[]>) => res.body)
            )
            .subscribe(
                (res: IRankingPerOrder[]) => {
                    this.rankingPerOrders = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInRankingPerOrders();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IRankingPerOrder) {
        return item.id;
    }

    registerChangeInRankingPerOrders() {
        this.eventSubscriber = this.eventManager.subscribe('rankingPerOrderListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
