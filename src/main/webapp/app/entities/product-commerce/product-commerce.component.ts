import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import Swal from 'sweetalert2';

import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { AccountService } from 'app/core';
import { ProductCommerceService } from './product-commerce.service';

@Component({
    selector: 'jhi-product-commerce',
    templateUrl: './product-commerce.component.html'
})
export class ProductCommerceComponent implements OnInit, OnDestroy {
    productCommerces: IProductCommerce[];
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
        protected productCommerceService: ProductCommerceService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.productCommerceService
            .query()
            .pipe(
                filter((res: HttpResponse<IProductCommerce[]>) => res.ok),
                map((res: HttpResponse<IProductCommerce[]>) => res.body)
            )
            .subscribe(
                (res: IProductCommerce[]) => {
                    this.productCommerces = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInProductCommerces();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IProductCommerce) {
        return item.id;
    }

    registerChangeInProductCommerces() {
        this.eventSubscriber = this.eventManager.subscribe('productCommerceListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    deleteItem(id: number) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea eliminar el inventario?',
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
        this.productCommerceService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productCommerceListModification',
                content: 'Deleted a Prdoduct Commerce'
            });
            this.swalWithBootstrapButtons.fire('Eliminado!', 'El inventario se ha sido eliminado.', 'success');
        });
    }
}
