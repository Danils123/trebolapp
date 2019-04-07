import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IOrderItem } from 'app/shared/model/order-item.model';
import { OrderItemService } from './order-item.service';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra';
import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from 'app/entities/commerce';

@Component({
    selector: 'jhi-order-item-update',
    templateUrl: './order-item-update.component.html'
})
export class OrderItemUpdateComponent implements OnInit {
    orderItem: IOrderItem;
    isSaving: boolean;

    userextras: IUserExtra[];

    commerce: ICommerce[];
    date: string;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected orderItemService: OrderItemService,
        protected userExtraService: UserExtraService,
        protected commerceService: CommerceService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ orderItem }) => {
            this.orderItem = orderItem;
            this.date = this.orderItem.date != null ? this.orderItem.date.format(DATE_TIME_FORMAT) : null;
        });
        this.userExtraService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUserExtra[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserExtra[]>) => response.body)
            )
            .subscribe((res: IUserExtra[]) => (this.userextras = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        this.orderItem.date = this.date != null ? moment(this.date, DATE_TIME_FORMAT) : null;
        if (this.orderItem.id !== undefined) {
            this.subscribeToSaveResponse(this.orderItemService.update(this.orderItem));
        } else {
            this.subscribeToSaveResponse(this.orderItemService.create(this.orderItem));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderItem>>) {
        result.subscribe((res: HttpResponse<IOrderItem>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserExtraById(index: number, item: IUserExtra) {
        return item.id;
    }

    trackCommerceById(index: number, item: ICommerce) {
        return item.id;
    }
}
