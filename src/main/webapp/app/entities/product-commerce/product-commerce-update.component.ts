import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from './product-commerce.service';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';
import { IProductList } from 'app/shared/model/product-list.model';
import { ProductListService } from 'app/entities/product-list';
import Swal from 'sweetalert2';
import { AccountService } from 'app/core';
import { ICommerce, Commerce } from 'app/shared/model/commerce.model';
import { CommerceService } from '../commerce/commerce.service';

@Component({
    selector: 'jhi-product-commerce-update',
    templateUrl: './product-commerce-update.component.html'
})
export class ProductCommerceUpdateComponent implements OnInit {
    productCommerce: IProductCommerce;
    isSaving: boolean;
    commerce: ICommerce[];

    products: IProduct[];

    productlists: IProductList[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected productCommerceService: ProductCommerceService,
        protected productService: ProductService,
        protected productListService: ProductListService,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService,
        protected commerceService: CommerceService
    ) {
        this.getCommerce();
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productCommerce }) => {
            this.productCommerce = productCommerce;
        });

        this.productService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProduct[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProduct[]>) => response.body)
            )
            .subscribe((res: IProduct[]) => (this.products = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.productListService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductList[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductList[]>) => response.body)
            )
            .subscribe((res: IProductList[]) => (this.productlists = res), (res: HttpErrorResponse) => this.onError(res.message));

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

    previousState() {
        window.history.back();
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

    save() {
        this.getCommerce();
        let commerces: ICommerce[];
        commerces = this.accountService.userExtra.commerces;
        this.isSaving = true;
        if (this.productCommerce.id !== undefined) {
            this.subscribeToSaveResponse(this.productCommerceService.update(this.productCommerce));
        } else {
            this.productCommerce.commerce_id = commerces[0].id;
            this.subscribeToSaveResponse(this.productCommerceService.create(this.productCommerce));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductCommerce>>) {
        result.subscribe((res: HttpResponse<IProductCommerce>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            type: 'success',
            title: 'Inventario guardado satisfactoriamente'
        });
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackProductById(index: number, item: IProduct) {
        return item.id;
    }

    trackProductListById(index: number, item: IProductList) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
