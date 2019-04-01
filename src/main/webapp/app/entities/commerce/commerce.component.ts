import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import Swal from 'sweetalert2';

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

    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });

    constructor(
        protected commerceService: CommerceService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        if (this.accountService.user.authorities.filter(item => item === 'ROLE_VENDEDOR').length > 0) {
            this.commerceService
                .queryByCommerce(this.accountService.userExtra.id)
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
        } else {
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

    deleteItem(id: number) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea eliminar el comercio?',
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
        this.commerceService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'commerceListModification',
                content: 'Deleted a commerce'
            });
            this.swalWithBootstrapButtons.fire('Eliminado!', 'El Comercio se ha sido eliminado.', 'success');
        });
    }
}
