import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArchwizardModule } from 'angular-archwizard';

import { TrebolSharedModule } from 'app/shared';
import { PurchaseComponent, purchaseRoute } from './';

import { PurchaseSummaryComponent, purchaseSummaryRoute } from '../purchase-summary';
import { deliveryMapRoute, DeliveryMapComponent } from '../delivery-map';
import { MAPSHOP_ROUTE, MapshopComponent } from 'app/mapshop';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const ENTITY_STATES = [...purchaseRoute, purchaseSummaryRoute, ...deliveryMapRoute, MAPSHOP_ROUTE];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES), ArchwizardModule, ScrollToModule.forRoot(), NgbModule],
    declarations: [PurchaseComponent, PurchaseSummaryComponent, DeliveryMapComponent, MapshopComponent],
    entryComponents: [PurchaseComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolPurchaseModule {}
