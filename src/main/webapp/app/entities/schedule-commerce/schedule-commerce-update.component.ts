import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IScheduleCommerce } from 'app/shared/model/schedule-commerce.model';
import { ScheduleCommerceService } from './schedule-commerce.service';
import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from 'app/entities/commerce';

@Component({
    selector: 'jhi-schedule-commerce-update',
    templateUrl: './schedule-commerce-update.component.html'
})
export class ScheduleCommerceUpdateComponent implements OnInit {
    scheduleCommerce: IScheduleCommerce;
    isSaving: boolean;

    commerce: ICommerce[];
    openTime: string;
    closingtime: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected scheduleCommerceService: ScheduleCommerceService,
        protected commerceService: CommerceService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ scheduleCommerce }) => {
            this.scheduleCommerce = scheduleCommerce;
            this.openTime = this.scheduleCommerce.openTime != null ? this.scheduleCommerce.openTime.format(DATE_TIME_FORMAT) : null;
            this.closingtime =
                this.scheduleCommerce.closingtime != null ? this.scheduleCommerce.closingtime.format(DATE_TIME_FORMAT) : null;
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
        this.scheduleCommerce.openTime = this.openTime != null ? moment(this.openTime, DATE_TIME_FORMAT) : null;
        this.scheduleCommerce.closingtime = this.closingtime != null ? moment(this.closingtime, DATE_TIME_FORMAT) : null;
        if (this.scheduleCommerce.id !== undefined) {
            this.subscribeToSaveResponse(this.scheduleCommerceService.update(this.scheduleCommerce));
        } else {
            this.subscribeToSaveResponse(this.scheduleCommerceService.create(this.scheduleCommerce));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IScheduleCommerce>>) {
        result.subscribe((res: HttpResponse<IScheduleCommerce>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
