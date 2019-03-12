import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IRankingPerOrder } from 'app/shared/model/ranking-per-order.model';
import { RankingPerOrderService } from './ranking-per-order.service';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra';

@Component({
    selector: 'jhi-ranking-per-order-update',
    templateUrl: './ranking-per-order-update.component.html'
})
export class RankingPerOrderUpdateComponent implements OnInit {
    rankingPerOrder: IRankingPerOrder;
    isSaving: boolean;

    userextras: IUserExtra[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected rankingPerOrderService: RankingPerOrderService,
        protected userExtraService: UserExtraService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ rankingPerOrder }) => {
            this.rankingPerOrder = rankingPerOrder;
        });
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
        if (this.rankingPerOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.rankingPerOrderService.update(this.rankingPerOrder));
        } else {
            this.subscribeToSaveResponse(this.rankingPerOrderService.create(this.rankingPerOrder));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IRankingPerOrder>>) {
        result.subscribe((res: HttpResponse<IRankingPerOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
