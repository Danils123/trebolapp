import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProductList } from 'app/shared/model/product-list.model';
import { ProductListService } from './product-list.service';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from 'app/entities/product-commerce';

@Component({
    selector: 'jhi-product-list-update',
    templateUrl: './product-list-update.component.html'
})
export class ProductListUpdateComponent implements OnInit {
    productList: IProductList;
    isSaving: boolean;

    productcommerces: IProductCommerce[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected productListService: ProductListService,
        protected productCommerceService: ProductCommerceService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ productList }) => {
            this.productList = productList;
        });
        this.productCommerceService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductCommerce[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductCommerce[]>) => response.body)
            )
            .subscribe((res: IProductCommerce[]) => (this.productcommerces = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.productList.id !== undefined) {
            this.subscribeToSaveResponse(this.productListService.update(this.productList));
        } else {
            this.subscribeToSaveResponse(this.productListService.create(this.productList));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductList>>) {
        result.subscribe((res: HttpResponse<IProductList>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackProductCommerceById(index: number, item: IProductCommerce) {
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
