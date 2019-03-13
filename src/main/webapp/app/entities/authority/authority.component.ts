import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { AccountService } from 'app/core';
import { AuthorityService } from 'app/entities/authority/authority.service';
import { IAuthority } from 'app/shared/model/authority.model';

@Component({
    selector: 'jhi-authority',
    templateUrl: './authority.component.html'
})
export class AuthorityComponent implements OnInit, OnDestroy {
    authorities: IAuthority[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected authorityService: AuthorityService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.authorityService
            .query()
            .pipe(
                filter((res: HttpResponse<IAuthority[]>) => res.ok),
                map((res: HttpResponse<IAuthority[]>) => res.body)
            )
            .subscribe(
                (res: IAuthority[]) => {
                    this.authorities = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInAuthorities();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackName(name: string, item: IAuthority) {
        return item.name;
    }

    registerChangeInAuthorities() {
        this.eventSubscriber = this.eventManager.subscribe('authorityListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
