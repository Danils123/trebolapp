import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from './offer.service';
import Swal from 'sweetalert2';
import { filter, map } from 'rxjs/operators';
import { AccountService } from '../../core/auth/account.service';
import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from '../commerce/commerce.service';
import { UserExtraService } from '../user-extra';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { DatepickerOptions } from 'ng2-datepicker';
import * as enLocale from 'date-fns/locale/en';
import { CommerceUserService } from '../commerce-user';
import { CommerceUser, ICommerceUser } from 'app/shared/model/commerce-user.model';
import { DATE_FORMAT } from '../../shared/constants/input.constants';
import { DatePipe } from '@angular/common';
import moment = require('moment');
import { NgForm } from '@angular/forms';
@Component({
    selector: 'jhi-offer-update',
    templateUrl: './offer-update.component.html'
})
export class OfferUpdateComponent implements OnInit {
    offer: IOffer;
    isSaving: boolean;
    minValue = true;
    maxValue = true;
    commerceUsers: ICommerceUser[];

    options: DatepickerOptions = {
        minDate: new Date(Date.now()),
        placeholder: 'Click to select a date',
        displayFormat: 'DD MM YYYY'
    };

    constructor(
        protected offerService: OfferService,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService,
        protected commerceService: CommerceService,
        protected userExtraService: UserExtraService,
        protected commerceUserService: CommerceUserService
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ offer }) => {
            this.offer = offer;
            this.offer.type = 1;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.offer.commerces = [];
        this.commerceService
            .queryByCommerce(this.accountService.userExtra.id)
            .pipe(
                filter((res: HttpResponse<ICommerce[]>) => res.ok),
                map((res: HttpResponse<ICommerce[]>) => res.body)
            )
            .subscribe((res2: ICommerce[]) => {
                this.offer.commerces = res2;
                if (this.offer.id !== undefined) {
                    this.subscribeToSaveResponse(this.offerService.update(this.offer));
                } else {
                    this.offer.disabled = false;
                    this.subscribeToSaveResponse(this.offerService.create(this.offer));
                }
            });
    }
    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffer>>) {
        result.subscribe((res: HttpResponse<IOffer>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess(response: HttpResponse<IOffer>) {
        /*
        POR AHORA SE QUEDA COMENTADO PARA ASEGURARSE QUE TODO FUNCIONE SIN PROBLEMAS SIN MODIFICAR EL USUARIO EXTRA COMO TAL
        this.userExtraService.find(this.accountService.userExtra.id).subscribe((res: HttpResponse<IUserExtra>) => {

            const commercesSave = res.body.commerces[0];

            const userExtraSave = res.body;
            if (commercesSave.offers == null) {
                commercesSave.offers = [];
                commercesSave.offers.push(response.body);
            } else {
                commercesSave.offers.push(response.body);
            }
            commercesSave.userExtra = res.body;
            this.commerceService.update(commercesSave).subscribe((res: HttpResponse<ICommerce>) => {
                userExtraSave.commerces[0] = res.body;
                this.userExtraService.update(userExtraSave).subscribe((res: HttpResponse<IUserExtra>) => {
                    this.userExtraService.refreshUser();
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                    });

                    Toast.fire({
                        type: 'success',
                        title: 'Oferta agregada satisfactoriamente'
                    });
                    this.previousState();
                });
            });
        });
        */
        console.log(response.body.expirationDate);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            type: 'success',
            title: 'Oferta agregada satisfactoriamente'
        });
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    validateMinMax(form: NgForm) {
        this.minValue = true;
        this.maxValue = true;
        if (this.offer.discount != null) {
            if (this.offer.discount < 1) {
                this.minValue = false;
                form.form.controls.discount.setErrors({ incorrect: true });
            } else {
                this.minValue = true;
            }

            if (this.offer.discount > 99) {
                this.maxValue = false;
                form.form.controls.discount.setErrors({ incorrect: true });
            } else {
                this.maxValue = true;
            }
        }
        return form;
        // pattern="^([a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+(_[a-zA-Z-0-9ñÑáéíóúÁÉÍÓÚ\s]+)*)(\s([a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+(_[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+)*))*$"
    }
}
