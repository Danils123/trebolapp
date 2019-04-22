import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import Swal from 'sweetalert2';
import { ProductService } from 'app/entities/product';

import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { AccountService } from 'app/core';
import { ProductCommerceService } from './product-commerce.service';
import { IProduct } from 'app/shared/model/product.model';
import { ICommerce, Commerce } from 'app/shared/model/commerce.model';
import { CommerceService } from '../commerce/commerce.service';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from '../user-extra/user-extra.service';

@Component({
    selector: 'jhi-product-commerce',
    templateUrl: './product-commerce.component.html'
})
export class ProductCommerceComponent implements OnInit {
    productCommerces: IProductCommerce[];
    currentAccount: any;
    eventSubscriber: Subscription;
    commerce: ICommerce[];
    userExtra: IUserExtra;

    products: IProduct[];

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
        protected productService: ProductService,
        protected accountService: AccountService,
        protected commerceService: CommerceService,
        private userExtraService: UserExtraService
    ) {}

    loadAll() {
        this.accountService.fetch().subscribe(user => {
            this.userExtraService.findByUserId(user.body.id).subscribe(userExtraResponse => {
                this.commerceService
                    .queryByCommerce(userExtraResponse.body.id)
                    .pipe(
                        filter((res: HttpResponse<ICommerce[]>) => res.ok),
                        map((res: HttpResponse<ICommerce[]>) => res.body)
                    )
                    .subscribe(
                        (res: ICommerce[]) => {
                            this.commerce = res;
                            if (this.isVendedor) {
                                this.productCommerceService
                                    .queryByCommerceId(this.commerce[0].id)
                                    .pipe(
                                        filter((res2: HttpResponse<IProductCommerce[]>) => res2.ok),
                                        map((res2: HttpResponse<IProductCommerce[]>) => res2.body)
                                    )
                                    .subscribe(
                                        (res2: IProductCommerce[]) => {
                                            this.productCommerces = res2;
                                        },
                                        (res2: HttpErrorResponse) => this.onError(res2.message)
                                    );
                            } else {
                                this.productCommerceService
                                    .query()
                                    .pipe(
                                        filter((res2: HttpResponse<IProductCommerce[]>) => res2.ok),
                                        map((res2: HttpResponse<IProductCommerce[]>) => res2.body)
                                    )
                                    .subscribe(
                                        (res2: IProductCommerce[]) => {
                                            this.productCommerces = res;
                                        },
                                        (res2: HttpErrorResponse) => this.onError(res2.message)
                                    );
                            }
                        },
                        (res: HttpErrorResponse) => this.onError(res.message)
                    );
            });
        });

        this.productService
            .query()
            .pipe(
                filter((res: HttpResponse<IProduct[]>) => res.ok),
                map((res: HttpResponse<IProduct[]>) => res.body)
            )
            .subscribe(
                (res: IProduct[]) => {
                    this.products = res;
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

    isVendedor() {
        return this.accountService.identity().then(account => this.accountService.hasAnyAuthority(['ROLE_VENDEDOR']));
    }

    getCommerce() {
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
