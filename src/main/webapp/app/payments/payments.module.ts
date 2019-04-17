import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrebolSharedModule } from 'app/shared';
import { PAYMENTS_ROUTE, PaymentsComponent } from './';

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild([PAYMENTS_ROUTE]), FormsModule, ReactiveFormsModule],
    declarations: [PaymentsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StripePaymentsModule {}
// JHipster Stripe Module will add new line here
