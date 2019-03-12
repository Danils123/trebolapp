import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    ScheduleCommerceComponent,
    ScheduleCommerceDetailComponent,
    ScheduleCommerceUpdateComponent,
    ScheduleCommerceDeletePopupComponent,
    ScheduleCommerceDeleteDialogComponent,
    scheduleCommerceRoute,
    scheduleCommercePopupRoute
} from './';

const ENTITY_STATES = [...scheduleCommerceRoute, ...scheduleCommercePopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ScheduleCommerceComponent,
        ScheduleCommerceDetailComponent,
        ScheduleCommerceUpdateComponent,
        ScheduleCommerceDeleteDialogComponent,
        ScheduleCommerceDeletePopupComponent
    ],
    entryComponents: [
        ScheduleCommerceComponent,
        ScheduleCommerceUpdateComponent,
        ScheduleCommerceDeleteDialogComponent,
        ScheduleCommerceDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolScheduleCommerceModule {}
