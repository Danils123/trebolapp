import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { AccountService } from 'app/core';
import { AuthorityService } from 'app/entities/authority/authority.service';
import { IAuthority } from 'app/shared/model/authority.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'jhi-authority',
    templateUrl: './authority.component.html'
})
export class AuthorityComponent implements OnInit, OnDestroy {
    authorities: IAuthority[];
    currentAccount: any;
    eventSubscriber: Subscription;
    _filterQuery = '';
    filteredAuthorities: IAuthority[];

    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });

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
                    this.filteredAuthorities = res;
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

    deleteItem(name: string) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea eliminar la categoría?',
                text: 'Si continúa, no podrá revertir el cambio',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmDelete(name);
                }
            });
    }
    confirmDelete(name: string) {
        this.authorityService.delete(name).subscribe(response => {
            this.eventManager.broadcast({
                name: 'authorityListModification',
                content: 'Deleted an authority'
            });
            this.swalWithBootstrapButtons.fire('Eliminada!', 'El Rol ha sido eliminado.', 'success');
        });
    }

    get filterQuery(): string {
        return this._filterQuery;
    }

    set filterQuery(value: string) {
        this._filterQuery = value;
        this.filteredAuthorities = this.filterQuery ? this.doFilter(this.filterQuery) : this.authorities;
    }

    doFilter(filterBy: string): IAuthority[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.authorities.filter((authority: IAuthority) => authority.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }
}
