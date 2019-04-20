import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArchwizardModule } from 'angular-archwizard';

import { TrebolSharedModule } from 'app/shared';
import { PurchaseComponent, purchaseRoute } from './';

import { PurchaseSummaryComponent, purchaseSummaryRoute } from '../purchase-summary';
import { deliveryMapRoute, DeliveryMapComponent } from '../delivery-map';

const ENTITY_STATES = [...purchaseRoute, purchaseSummaryRoute, ...deliveryMapRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES), ArchwizardModule],
    declarations: [PurchaseComponent, PurchaseSummaryComponent, DeliveryMapComponent],
    entryComponents: [PurchaseComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolPurchaseModule {}
