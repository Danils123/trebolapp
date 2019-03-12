import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    PointsCommerceComponent,
    PointsCommerceDetailComponent,
    PointsCommerceUpdateComponent,
    PointsCommerceDeletePopupComponent,
    PointsCommerceDeleteDialogComponent,
    pointsCommerceRoute,
    pointsCommercePopupRoute
} from './';

const ENTITY_STATES = [...pointsCommerceRoute, ...pointsCommercePopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        PointsCommerceComponent,
        PointsCommerceDetailComponent,
        PointsCommerceUpdateComponent,
        PointsCommerceDeleteDialogComponent,
        PointsCommerceDeletePopupComponent
    ],
    entryComponents: [
        PointsCommerceComponent,
        PointsCommerceUpdateComponent,
        PointsCommerceDeleteDialogComponent,
        PointsCommerceDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolPointsCommerceModule {}
