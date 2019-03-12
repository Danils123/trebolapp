import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IListSchedule } from 'app/shared/model/list-schedule.model';
import { AccountService } from 'app/core';
import { ListScheduleService } from './list-schedule.service';

@Component({
    selector: 'jhi-list-schedule',
    templateUrl: './list-schedule.component.html'
})
export class ListScheduleComponent implements OnInit, OnDestroy {
    listSchedules: IListSchedule[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected listScheduleService: ListScheduleService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.listScheduleService
            .query()
            .pipe(
                filter((res: HttpResponse<IListSchedule[]>) => res.ok),
                map((res: HttpResponse<IListSchedule[]>) => res.body)
            )
            .subscribe(
                (res: IListSchedule[]) => {
                    this.listSchedules = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInListSchedules();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IListSchedule) {
        return item.id;
    }

    registerChangeInListSchedules() {
        this.eventSubscriber = this.eventManager.subscribe('listScheduleListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
