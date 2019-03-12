import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IScheduleCommerce } from 'app/shared/model/schedule-commerce.model';
import { AccountService } from 'app/core';
import { ScheduleCommerceService } from './schedule-commerce.service';

@Component({
    selector: 'jhi-schedule-commerce',
    templateUrl: './schedule-commerce.component.html'
})
export class ScheduleCommerceComponent implements OnInit, OnDestroy {
    scheduleCommerces: IScheduleCommerce[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected scheduleCommerceService: ScheduleCommerceService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.scheduleCommerceService
            .query()
            .pipe(
                filter((res: HttpResponse<IScheduleCommerce[]>) => res.ok),
                map((res: HttpResponse<IScheduleCommerce[]>) => res.body)
            )
            .subscribe(
                (res: IScheduleCommerce[]) => {
                    this.scheduleCommerces = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInScheduleCommerces();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IScheduleCommerce) {
        return item.id;
    }

    registerChangeInScheduleCommerces() {
        this.eventSubscriber = this.eventManager.subscribe('scheduleCommerceListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
