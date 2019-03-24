import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IListPurchase } from 'app/shared/model/list-purchase.model';
import { AccountService } from 'app/core';
import { ListPurchaseService } from './list-purchase.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ICategory } from 'app/shared/model/category.model';

@Component({
    selector: 'jhi-list-purchase',
    templateUrl: './list-purchase.component.html'
})
export class ListPurchaseComponent implements OnInit, OnDestroy {
    listPurchases: IListPurchase[];
    currentAccount: any;
    eventSubscriber: Subscription;
    _filterQuery = '';
    filteredListPurchase: IListPurchase[];
    view = true;

    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });

    constructor(
        protected listPurchaseService: ListPurchaseService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.listPurchaseService
            .query()
            .pipe(
                filter((res: HttpResponse<IListPurchase[]>) => res.ok),
                map((res: HttpResponse<IListPurchase[]>) => res.body)
            )
            .subscribe(
                (res: IListPurchase[]) => {
                    this.listPurchases = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInListPurchases();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IListPurchase) {
        return item.id;
    }

    registerChangeInListPurchases() {
        this.eventSubscriber = this.eventManager.subscribe('listPurchaseListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    deleteItem(id: number) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea eliminar la lista?',
                text: 'Si continúa, no podrá revertir el cambio',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmDelete(id);
                }
            });
    }
    confirmDelete(id: number) {
        this.listPurchaseService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'listPurchaseListModification',
                content: 'Deleted an list'
            });
            this.swalWithBootstrapButtons.fire('Eliminada!', 'La lista ha sido eliminada.', 'success');
        });
    }

    get filterQuery(): string {
        return this._filterQuery;
    }

    set filterQuery(value: string) {
        this._filterQuery = value;
        this.filteredListPurchase = this.filterQuery ? this.doFilter(this.filterQuery) : this.listPurchases;
    }

    doFilter(filterBy: string): ICategory[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.listPurchases.filter((listPurchase: IListPurchase) => listPurchase.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    viewGrid() {
        this.view = false;
    }

    viewTag() {
        this.view = true;
    }
}
