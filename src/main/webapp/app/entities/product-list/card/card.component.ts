import { Component, Input, OnInit } from '@angular/core';
import { IProductList, ProductList } from 'app/shared/model/product-list.model';
import Swal from 'sweetalert2';
import { ProductListService } from 'app/entities/product-list';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { AccountService } from 'app/core';
import { IListPurchase, ListPurchase } from 'app/shared/model/list-purchase.model';
import { ListPurchaseService } from 'app/entities/list-purchase';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ListPurchaseAll } from 'app/shared/model/listpurchaseall.model';

@Component({
    selector: 'jhi-card',
    templateUrl: './card.component.html',
    styles: []
})
export class CardComponent implements OnInit {
    @Input() productList: ProductList;
    productListarray: IProductList[];
    list: ListPurchase;
    currentAccount: any;
    eventSubscriber: Subscription;
    listpurchaseall: ListPurchaseAll;
    listpurchaseallArray: ListPurchaseAll[];

    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });

    constructor(
        protected productListService: ProductListService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected listPurchaseService: ListPurchaseService
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
                    for (const value of res) {
                        if (value.id === this.productList.idlistpurchase) {
                            this.list = value;
                        }
                    }

                    for (const purchase of res) {
                        for (const product of this.productListarray) {
                            if (purchase.id === product.idlistpurchase) {
                                this.listpurchaseall.productlist.push(product);
                            }
                        }
                        this.listpurchaseallArray.push(this.listpurchaseall);
                    }
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
    registerChangeInListPurchases() {
        this.eventSubscriber = this.eventManager.subscribe('listPurchaseListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    deleteItem(id: number) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea eliminar el producto?',
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
        this.productListService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productListListModification',
                content: 'Deleted an productList'
            });
            this.swalWithBootstrapButtons.fire('Eliminada!', 'La lista ha sido eliminada.', 'success');
        });
    }
}
