import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import { DeliveryMapComponent, deliveryMapRoute } from './';

const ENTITY_STATES = [...deliveryMapRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [DeliveryMapComponent],
    entryComponents: [DeliveryMapComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolDeliveryMapModule {}
