import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    ListScheduleComponent,
    ListScheduleDetailComponent,
    ListScheduleUpdateComponent,
    ListScheduleDeletePopupComponent,
    ListScheduleDeleteDialogComponent,
    listScheduleRoute,
    listSchedulePopupRoute
} from './';

const ENTITY_STATES = [...listScheduleRoute, ...listSchedulePopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ListScheduleComponent,
        ListScheduleDetailComponent,
        ListScheduleUpdateComponent,
        ListScheduleDeleteDialogComponent,
        ListScheduleDeletePopupComponent
    ],
    entryComponents: [
        ListScheduleComponent,
        ListScheduleUpdateComponent,
        ListScheduleDeleteDialogComponent,
        ListScheduleDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolListScheduleModule {}
