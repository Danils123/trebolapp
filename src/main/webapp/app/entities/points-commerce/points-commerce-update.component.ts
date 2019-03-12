import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IPointsCommerce } from 'app/shared/model/points-commerce.model';
import { PointsCommerceService } from './points-commerce.service';
import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from 'app/entities/commerce';

@Component({
    selector: 'jhi-points-commerce-update',
    templateUrl: './points-commerce-update.component.html'
})
export class PointsCommerceUpdateComponent implements OnInit {
    pointsCommerce: IPointsCommerce;
    isSaving: boolean;

    commerce: ICommerce[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected pointsCommerceService: PointsCommerceService,
        protected commerceService: CommerceService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ pointsCommerce }) => {
            this.pointsCommerce = pointsCommerce;
        });
        this.commerceService
            .query({ filter: 'pointscommerce-is-null' })
            .pipe(
                filter((mayBeOk: HttpResponse<ICommerce[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICommerce[]>) => response.body)
            )
            .subscribe(
                (res: ICommerce[]) => {
                    if (!this.pointsCommerce.commerce || !this.pointsCommerce.commerce.id) {
                        this.commerce = res;
                    } else {
                        this.commerceService
                            .find(this.pointsCommerce.commerce.id)
                            .pipe(
                                filter((subResMayBeOk: HttpResponse<ICommerce>) => subResMayBeOk.ok),
                                map((subResponse: HttpResponse<ICommerce>) => subResponse.body)
                            )
                            .subscribe(
                                (subRes: ICommerce) => (this.commerce = [subRes].concat(res)),
                                (subRes: HttpErrorResponse) => this.onError(subRes.message)
                            );
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.pointsCommerce.id !== undefined) {
            this.subscribeToSaveResponse(this.pointsCommerceService.update(this.pointsCommerce));
        } else {
            this.subscribeToSaveResponse(this.pointsCommerceService.create(this.pointsCommerce));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPointsCommerce>>) {
        result.subscribe((res: HttpResponse<IPointsCommerce>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCommerceById(index: number, item: ICommerce) {
        return item.id;
    }
}
