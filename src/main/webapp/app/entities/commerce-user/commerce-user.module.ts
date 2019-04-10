import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    CommerceUserComponent,
    CommerceUserDetailComponent,
    CommerceUserUpdateComponent,
    CommerceUserDeletePopupComponent,
    CommerceUserDeleteDialogComponent,
    commerceUserRoute,
    commerceUserPopupRoute
} from './';

const ENTITY_STATES = [...commerceUserRoute, ...commerceUserPopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CommerceUserComponent,
        CommerceUserDetailComponent,
        CommerceUserUpdateComponent,
        CommerceUserDeleteDialogComponent,
        CommerceUserDeletePopupComponent
    ],
    entryComponents: [
        CommerceUserComponent,
        CommerceUserUpdateComponent,
        CommerceUserDeleteDialogComponent,
        CommerceUserDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolCommerceUserModule {}
