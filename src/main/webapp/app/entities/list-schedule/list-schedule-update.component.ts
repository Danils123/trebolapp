import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IListSchedule } from 'app/shared/model/list-schedule.model';
import { ListScheduleService } from './list-schedule.service';
import { IProductList } from 'app/shared/model/product-list.model';
import { ProductListService } from 'app/entities/product-list';

@Component({
    selector: 'jhi-list-schedule-update',
    templateUrl: './list-schedule-update.component.html'
})
export class ListScheduleUpdateComponent implements OnInit {
    listSchedule: IListSchedule;
    isSaving: boolean;

    productlists: IProductList[];
    time: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected listScheduleService: ListScheduleService,
        protected productListService: ProductListService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ listSchedule }) => {
            this.listSchedule = listSchedule;
            this.time = this.listSchedule.time != null ? this.listSchedule.time.format(DATE_TIME_FORMAT) : null;
        });
        this.productListService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductList[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductList[]>) => response.body)
            )
            .subscribe((res: IProductList[]) => (this.productlists = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.listSchedule.time = this.time != null ? moment(this.time, DATE_TIME_FORMAT) : null;
        if (this.listSchedule.id !== undefined) {
            this.subscribeToSaveResponse(this.listScheduleService.update(this.listSchedule));
        } else {
            this.subscribeToSaveResponse(this.listScheduleService.create(this.listSchedule));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IListSchedule>>) {
        result.subscribe((res: HttpResponse<IListSchedule>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
}
