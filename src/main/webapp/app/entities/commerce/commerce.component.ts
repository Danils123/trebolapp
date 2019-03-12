import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICommerce } from 'app/shared/model/commerce.model';
import { AccountService } from 'app/core';
import { CommerceService } from './commerce.service';

@Component({
    selector: 'jhi-commerce',
    templateUrl: './commerce.component.html'
})
export class CommerceComponent implements OnInit, OnDestroy {
    commerce: ICommerce[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected commerceService: CommerceService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.commerceService
            .query()
            .pipe(
                filter((res: HttpResponse<ICommerce[]>) => res.ok),
                map((res: HttpResponse<ICommerce[]>) => res.body)
            )
            .subscribe(
                (res: ICommerce[]) => {
                    this.commerce = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCommerce();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICommerce) {
        return item.id;
    }

    registerChangeInCommerce() {
        this.eventSubscriber = this.eventManager.subscribe('commerceListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
