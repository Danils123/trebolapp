import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    ProductCommerceComponent,
    ProductCommerceDetailComponent,
    ProductCommerceUpdateComponent,
    ProductCommerceDeletePopupComponent,
    ProductCommerceDeleteDialogComponent,
    productCommerceRoute,
    productCommercePopupRoute
} from './';

const ENTITY_STATES = [...productCommerceRoute, ...productCommercePopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductCommerceComponent,
        ProductCommerceDetailComponent,
        ProductCommerceUpdateComponent,
        ProductCommerceDeleteDialogComponent,
        ProductCommerceDeletePopupComponent
    ],
    entryComponents: [
        ProductCommerceComponent,
        ProductCommerceUpdateComponent,
        ProductCommerceDeleteDialogComponent,
        ProductCommerceDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolProductCommerceModule {}
