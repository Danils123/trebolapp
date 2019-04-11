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

            if (this.offer.expirationDate === null || this.offer.expirationDate === undefined) {
                // this.offer.expirationDate = new Date();
            }
        });
    }

    previousState() {
        window.history.back();
        /*
       this.commerceUserService
       .findUsersByCommerce(77)
       .pipe(
           filter((res: HttpResponse<IUserExtra[]>) => res.ok),
           map((res: HttpResponse<IUserExtra[]>) => res.body)
       )
       .subscribe(
           (res: IUserExtra[]) => {
               console.log(res);
           }
       );

       */
    }

    save() {
        this.isSaving = true;
        if (this.offer.commerces == null) {
            this.offer.commerces = [];
            this.offer.commerces.push(this.accountService.userExtra.commerces[0]);
        } else {
            this.offer.commerces.push(this.accountService.userExtra.commerces[0]);
        }
        if (this.offer.id !== undefined) {
            this.subscribeToSaveResponse(this.offerService.update(this.offer));
        } else {
            this.offer.disabled = false;
            this.subscribeToSaveResponse(this.offerService.create(this.offer));
        }
    }
    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffer>>) {
        result.subscribe((res: HttpResponse<IOffer>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess(res: HttpResponse<IOffer>) {
        const commercesSave = this.accountService.userExtra.commerces[0];
        const userExtraSave = this.accountService.userExtra;
        if (commercesSave.offers == null) {
            commercesSave.offers = [];
            commercesSave.offers.push(res.body);
        } else {
            commercesSave.offers.push(res.body);
        }

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
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    validateMinMax() {
        this.minValue = true;
        this.maxValue = true;
        if (this.offer.discount != null) {
            if (this.offer.discount < 1) {
                this.minValue = false;
            } else {
                this.minValue = true;
            }

            if (this.offer.discount > 100) {
                this.maxValue = false;
            } else {
                this.maxValue = true;
            }
        }
    }
}
