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
import { CalendarModule, CalendarWeekModule, DateAdapter } from 'angular-calendar';
import { CalendarComponent } from './calendar/calendar.component';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
const ENTITY_STATES = [...listScheduleRoute, ...listSchedulePopupRoute];

registerLocaleData(localeEs);
@NgModule({
    imports: [
        TrebolSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        CalendarWeekModule,
        CommonModule,
        FormsModule,
        NgbModalModule,
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        })
    ],

    declarations: [
        ListScheduleComponent,
        ListScheduleDetailComponent,
        ListScheduleUpdateComponent,
        ListScheduleDeleteDialogComponent,
        ListScheduleDeletePopupComponent,
        CalendarComponent
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
