import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IParametersCommerce } from 'app/shared/model/parameters-commerce.model';
import { AccountService } from 'app/core';
import { ParametersCommerceService } from './parameters-commerce.service';

@Component({
    selector: 'jhi-parameters-commerce',
    templateUrl: './parameters-commerce.component.html'
})
export class ParametersCommerceComponent implements OnInit, OnDestroy {
    parametersCommerces: IParametersCommerce[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected parametersCommerceService: ParametersCommerceService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.parametersCommerceService
            .query()
            .pipe(
                filter((res: HttpResponse<IParametersCommerce[]>) => res.ok),
                map((res: HttpResponse<IParametersCommerce[]>) => res.body)
            )
            .subscribe(
                (res: IParametersCommerce[]) => {
                    this.parametersCommerces = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInParametersCommerces();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IParametersCommerce) {
        return item.id;
    }

    registerChangeInParametersCommerces() {
        this.eventSubscriber = this.eventManager.subscribe('parametersCommerceListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
