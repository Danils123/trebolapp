import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IParametersCommerce } from 'app/shared/model/parameters-commerce.model';
import { ParametersCommerceService } from './parameters-commerce.service';
import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from 'app/entities/commerce';

@Component({
    selector: 'jhi-parameters-commerce-update',
    templateUrl: './parameters-commerce-update.component.html'
})
export class ParametersCommerceUpdateComponent implements OnInit {
    parametersCommerce: IParametersCommerce;
    isSaving: boolean;

    commerce: ICommerce[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected parametersCommerceService: ParametersCommerceService,
        protected commerceService: CommerceService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ parametersCommerce }) => {
            this.parametersCommerce = parametersCommerce;
        });
        this.commerceService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICommerce[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICommerce[]>) => response.body)
            )
            .subscribe((res: ICommerce[]) => (this.commerce = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.parametersCommerce.id !== undefined) {
            this.subscribeToSaveResponse(this.parametersCommerceService.update(this.parametersCommerce));
        } else {
            this.subscribeToSaveResponse(this.parametersCommerceService.create(this.parametersCommerce));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IParametersCommerce>>) {
        result.subscribe((res: HttpResponse<IParametersCommerce>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
