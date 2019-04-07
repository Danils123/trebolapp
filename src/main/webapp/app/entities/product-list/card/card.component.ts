import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { AccountService } from 'app/core';
import { Observable, Subscription } from 'rxjs';
import { Ilistpurchaseall } from '../../../shared/model/listpurchaseall.model';
import { IListPurchase } from 'app/shared/model/list-purchase.model';
import { ListPurchaseService } from 'app/entities/list-purchase';
import { DatepickerOptions } from 'ng2-datepicker';
import { IListSchedule } from 'app/shared/model/list-schedule.model';
import { ListScheduleService } from 'app/entities/list-schedule';
import { DATE_TIME_FORMAT } from 'app/shared';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import moment = require('moment');
import { IProductList, ProductList } from 'app/shared/model/product-list.model';

@Component({
    selector: 'jhi-card',
    templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
    @Input() listpurchaseAll: Ilistpurchaseall;
    currentAccount: any;
    eventSubscriber: Subscription;
    calendarVisible: boolean;
    listSchedule: IListSchedule;
    isSaving: boolean;
    hstep = 1;
    mstep = 15;
    ismeridian = true;

    options: DatepickerOptions = {
        minDate: new Date(Date.now()),
        placeholder: 'Seleccione una fecha',
        displayFormat: 'DD/MM/YYYY',
        useEmptyBarTitle: false
    };

    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected listPurchaseService: ListPurchaseService,
        protected listScheduleService: ListScheduleService
    ) {
        this.calendarVisible = false;
        this.listSchedule = new class implements IListSchedule {
            day: string;
            id: number;
            productList: IProductList;
            state: boolean;
            time: moment.Moment;
        }();
    }

    ngOnInit() {}

    deleteItem(listpurchase: IListPurchase) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea eliminar la lista?',
                text: 'Si continúa, no podrá revertir el cambio',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmDelete(listpurchase);
                }
            });
    }
    confirmDelete(listpurchase: IListPurchase) {
        listpurchase.state = false;
        this.listPurchaseService.update(listpurchase).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productListListModification',
                content: 'Deleted an productList'
            });
            this.swalWithBootstrapButtons.fire('Eliminada!', 'La lista ha sido eliminada.', 'success');
        });
    }

    programCalendar() {
        this.calendarVisible = true;
    }

    cancelCalendar() {
        this.calendarVisible = false;
    }

    saveCalendar() {
        this.calendarVisible = false;
        this.isSaving = true;
        this.listSchedule.state = true;
        const purchase = this.listpurchaseAll.listpurchase;
        const productlst = new ProductList(purchase.id);
        this.listSchedule.productList = productlst;
        console.log('list compra');
        console.log(this.listSchedule);
        /*this.listSchedule.time = this.listSchedule.time != null ? moment(this.listSchedule.time, DATE_TIME_FORMAT) : null;
        if (this.listSchedule.id !== undefined) {
            this.subscribeToSaveResponse(this.listScheduleService.update(this.listSchedule));
        } else {
            this.subscribeToSaveResponse(this.listScheduleService.create(this.listSchedule));
        }*/
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IListSchedule>>) {
        result.subscribe((res: HttpResponse<IListSchedule>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
            title: 'Fecha agregada satisfactoriamente'
        });
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
