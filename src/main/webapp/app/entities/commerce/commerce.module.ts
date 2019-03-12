import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    CommerceComponent,
    CommerceDetailComponent,
    CommerceUpdateComponent,
    CommerceDeletePopupComponent,
    CommerceDeleteDialogComponent,
    commerceRoute,
    commercePopupRoute
} from './';

const ENTITY_STATES = [...commerceRoute, ...commercePopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CommerceComponent,
        CommerceDetailComponent,
        CommerceUpdateComponent,
        CommerceDeleteDialogComponent,
        CommerceDeletePopupComponent
    ],
    entryComponents: [CommerceComponent, CommerceUpdateComponent, CommerceDeleteDialogComponent, CommerceDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolCommerceModule {}
