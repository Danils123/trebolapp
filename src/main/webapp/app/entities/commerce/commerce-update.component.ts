import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from './commerce.service';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from 'app/entities/product-commerce';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from 'app/entities/offer';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra';
import { AccountService } from 'app/core';

@Component({
    selector: 'jhi-commerce-update',
    templateUrl: './commerce-update.component.html'
})
export class CommerceUpdateComponent implements OnInit {
    commerce: ICommerce;
    isSaving: boolean;

    productcommerces: IProductCommerce[];

    offers: IOffer[];

    userextras: IUserExtra[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected commerceService: CommerceService,
        protected productCommerceService: ProductCommerceService,
        protected offerService: OfferService,
        protected userExtraService: UserExtraService,
        protected activatedRoute: ActivatedRoute,
        private accountService: AccountService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ commerce }) => {
            this.commerce = commerce;
            this.commerce.email = this.accountService.user.email;
        });
        this.productCommerceService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductCommerce[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductCommerce[]>) => response.body)
            )
            .subscribe((res: IProductCommerce[]) => (this.productcommerces = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.offerService
            .query({ filter: 'commerce-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<IOffer[]>) => mayBeOk.ok),
                map((response: HttpResponse<IOffer[]>) => response.body)
            )
            .subscribe(
                (res: IOffer[]) => {
                    if (!this.commerce.offer || !this.commerce.offer.id) {
                        this.offers = res;
                    } else {
                        this.offerService
                            .find(this.commerce.offer.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<IOffer>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<IOffer>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: IOffer) => (this.offers = [subRes].concat(res)),
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
        if (this.commerce.id !== undefined) {
            this.subscribeToSaveResponse(this.commerceService.update(this.commerce));
        } else {
            this.subscribeToSaveResponse(this.commerceService.create(this.commerce));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommerce>>) {
        result.subscribe((res: HttpResponse<ICommerce>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackOfferById(index: number, item: IOffer) {
        return item.id;
    }

    trackUserExtraById(index: number, item: IUserExtra) {
        return item.id;
    }
}
