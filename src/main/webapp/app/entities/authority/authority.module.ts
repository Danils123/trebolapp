import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    authorityRoute,
    authorityPopupRoute,
    AuthorityDetailComponent,
    AuthorityUpdateComponent,
    AuthorityDeleteDialogComponent,
    AuthorityDeletePopupComponent,
    AuthorityComponent
} from './';

const ENTITY_STATES = [...authorityRoute, ...authorityPopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AuthorityComponent,
        AuthorityDetailComponent,
        AuthorityUpdateComponent,
        AuthorityDeleteDialogComponent,
        AuthorityDeletePopupComponent
    ],
    entryComponents: [AuthorityComponent, AuthorityUpdateComponent, AuthorityDeleteDialogComponent, AuthorityDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolAuthorityModule {}
