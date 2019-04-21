import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPayment } from 'app/shared/model/payment.model';
import { Payment } from 'app/shared/model/payment.model';

import { PaymentService } from '../entities/payment/payment.service';
import * as moment from 'moment';
import { LoginModalService, AccountService, Account } from 'app/core';
import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';

import Swal from 'sweetalert2';
import { PaymentServiceService } from './payment-service.service';

@Component({
    selector: 'jhi-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['payments.scss']
})
export class PaymentsComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    elements: Elements;
    card: StripeElement;
    stripeTest: FormGroup;
    amount: number;
    currencySymbol: string;

    currency = 'usd';

    payment: IPayment = new Payment(0, moment(), '', '', 0, 'Orden Trebol', false);
    moment: moment.Moment;
    isSaving: boolean;

    elementsOptions: ElementsOptions = {
        locale: 'en'
    };

    constructor(
        private accountService: AccountService,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private fb: FormBuilder,
        private stripeService: StripeService,
        protected paymentService: PaymentService,
        private router: Router,
        private paymentServiceLocal: PaymentServiceService
    ) {
        this.amount = 10;
    }

    ngOnInit() {
        this.accountService.identity().then((account: Account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();

        this.stripeTest = this.fb.group({
            name: ['', [Validators.required]]
        });
        // this.paymentServiceLocal.amountEmitter.subscribe(pAmount => {
        //     this.amount=pAmount;

        // });
        this.stripeService.elements(this.elementsOptions).subscribe(elements => {
            this.elements = elements;
            // Only mount the element the first time
            if (!this.card) {
                this.card = this.elements.create('card', {
                    style: {
                        base: {
                            iconColor: '#666EE8',
                            color: '#31325F',
                            lineHeight: '40px',
                            fontWeight: 300,
                            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                            fontSize: '18px',
                            '::placeholder': {
                                color: '#CFD7E0'
                            }
                        }
                    }
                });
                this.card.mount('#card-element');
            }
        });

        switch (this.currency) {
            case 'usd': {
                this.currencySymbol = '$';
                break;
            }
            case 'eur': {
                this.currencySymbol = '€';
                break;
            }
            // All supported currencies can be found here: https://stripe.com/docs/currencies
            default:
                this.currencySymbol = this.currency;
        }
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.accountService.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>) {
        result.subscribe((res: HttpResponse<IPayment>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    // protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>) {
    //     result.subscribe((res: HttpResponse<IPayment>) => {
    //         this.onSaveSuccess();
    //         this.paymentServiceLocal.changeId(res.body.id);
    //     }, (res: HttpErrorResponse) => this.onSaveError());
    // }

    protected onSaveSuccess() {
        this.isSaving = false;
        const Toast = Swal.mixin({
            toast: true,
            position: 'center',
            showConfirmButton: true
        });
        Toast.fire({
            type: 'success',
            title: 'Pago realizado correctamente'
        });
        this.homeRedirect();
    }

    previousState() {
        window.history.back();
    }

    homeRedirect() {
        this.router.navigate(['/']);
    }

    protected onSaveError() {
        this.isSaving = false;
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: true
        });
        Toast.fire({
            type: 'error',
            title: 'Lo sentimos el pago no se pudo realizar'
        });
    }

    buy() {
        this.loading();
        const name = this.stripeTest.get('name').value;
        this.stripeService.createToken(this.card, { name }).subscribe(result => {
            if (result.token) {
                // Use the token to create a charge or a customer
                // https://stripe.com/docs/charges
                // console.log(result.token);
                this.payment.amount = this.amount;
                this.payment.currency = this.currency;
                this.payment.token = result.token.id;
                this.payment.date = moment();
                this.subscribeToSaveResponse(this.paymentService.createPaymentCurrentUser(this.payment));
            } else if (result.error) {
                // Error creating the token
                console.log('Error creating the token!');
                console.log(result.error.message);
            }
        });
    }

    loading() {
        Swal.fire({
            title: 'Procesando..',
            html: 'Por favor espere',
            showConfirmButton: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        }).then(result => {
            if (
                // Read more about handling dismissals
                result.dismiss === Swal.DismissReason.timer
            ) {
                console.log('I was closed by the timer');
            }
        });
    }
}
