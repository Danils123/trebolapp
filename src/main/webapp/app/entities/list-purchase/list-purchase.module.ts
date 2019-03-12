import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    ListPurchaseComponent,
    ListPurchaseDetailComponent,
    ListPurchaseUpdateComponent,
    ListPurchaseDeletePopupComponent,
    ListPurchaseDeleteDialogComponent,
    listPurchaseRoute,
    listPurchasePopupRoute
} from './';

const ENTITY_STATES = [...listPurchaseRoute, ...listPurchasePopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ListPurchaseComponent,
        ListPurchaseDetailComponent,
        ListPurchaseUpdateComponent,
        ListPurchaseDeleteDialogComponent,
        ListPurchaseDeletePopupComponent
    ],
    entryComponents: [
        ListPurchaseComponent,
        ListPurchaseUpdateComponent,
        ListPurchaseDeleteDialogComponent,
        ListPurchaseDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolListPurchaseModule {}
