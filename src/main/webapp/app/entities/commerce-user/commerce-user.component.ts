import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICommerceUser } from 'app/shared/model/commerce-user.model';
import { AccountService } from 'app/core';
import { CommerceUserService } from './commerce-user.service';

@Component({
    selector: 'jhi-commerce-user',
    templateUrl: './commerce-user.component.html'
})
export class CommerceUserComponent implements OnInit, OnDestroy {
    commerceUsers: ICommerceUser[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected commerceUserService: CommerceUserService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.commerceUserService
            .query()
            .pipe(
                filter((res: HttpResponse<ICommerceUser[]>) => res.ok),
                map((res: HttpResponse<ICommerceUser[]>) => res.body)
            )
            .subscribe(
                (res: ICommerceUser[]) => {
                    this.commerceUsers = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCommerceUsers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICommerceUser) {
        return item.id;
    }

    registerChangeInCommerceUsers() {
        this.eventSubscriber = this.eventManager.subscribe('commerceUserListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
