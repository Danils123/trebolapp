import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IListPurchase } from 'app/shared/model/list-purchase.model';
import { ListPurchaseService } from './list-purchase.service';
import { IProductList } from 'app/shared/model/product-list.model';
import { ProductListService } from 'app/entities/product-list';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra';

@Component({
    selector: 'jhi-list-purchase-update',
    templateUrl: './list-purchase-update.component.html'
})
export class ListPurchaseUpdateComponent implements OnInit {
    listPurchase: IListPurchase;
    isSaving: boolean;

    productlists: IProductList[];

    userextras: IUserExtra[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected listPurchaseService: ListPurchaseService,
        protected productListService: ProductListService,
        protected userExtraService: UserExtraService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ listPurchase }) => {
            this.listPurchase = listPurchase;
        });
        this.productListService
            .query({ filter: 'listpurchase-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IProductList[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductList[]>) => response.body)
            )
            .subscribe(
                (res: IProductList[]) => {
                    if (!this.listPurchase.productList || !this.listPurchase.productList.id) {
                        this.productlists = res;
                    } else {
                        this.productListService
                            .find(this.listPurchase.productList.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IProductList>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IProductList>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IProductList) => (this.productlists = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        this.userExtraService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUserExtra[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserExtra[]>) => response.body)
            )
            .subscribe((res: IUserExtra[]) => (this.userextras = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.listPurchase.id !== undefined) {
            this.subscribeToSaveResponse(this.listPurchaseService.update(this.listPurchase));
        } else {
            this.subscribeToSaveResponse(this.listPurchaseService.create(this.listPurchase));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IListPurchase>>) {
        result.subscribe((res: HttpResponse<IListPurchase>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackProductListById(index: number, item: IProductList) {
        return item.id;
    }

    trackUserExtraById(index: number, item: IUserExtra) {
        return item.id;
    }
}
