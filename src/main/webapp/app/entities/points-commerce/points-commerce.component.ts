import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPointsCommerce } from 'app/shared/model/points-commerce.model';
import { AccountService } from 'app/core';
import { PointsCommerceService } from './points-commerce.service';

@Component({
    selector: 'jhi-points-commerce',
    templateUrl: './points-commerce.component.html'
})
export class PointsCommerceComponent implements OnInit, OnDestroy {
    pointsCommerces: IPointsCommerce[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected pointsCommerceService: PointsCommerceService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.pointsCommerceService
            .query()
            .pipe(
                filter((res: HttpResponse<IPointsCommerce[]>) => res.ok),
                map((res: HttpResponse<IPointsCommerce[]>) => res.body)
            )
            .subscribe(
                (res: IPointsCommerce[]) => {
                    this.pointsCommerces = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInPointsCommerces();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPointsCommerce) {
        return item.id;
    }

    registerChangeInPointsCommerces() {
        this.eventSubscriber = this.eventManager.subscribe('pointsCommerceListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
