import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    ParametersCommerceComponent,
    ParametersCommerceDetailComponent,
    ParametersCommerceUpdateComponent,
    ParametersCommerceDeletePopupComponent,
    ParametersCommerceDeleteDialogComponent,
    parametersCommerceRoute,
    parametersCommercePopupRoute
} from './';

const ENTITY_STATES = [...parametersCommerceRoute, ...parametersCommercePopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ParametersCommerceComponent,
        ParametersCommerceDetailComponent,
        ParametersCommerceUpdateComponent,
        ParametersCommerceDeleteDialogComponent,
        ParametersCommerceDeletePopupComponent
    ],
    entryComponents: [
        ParametersCommerceComponent,
        ParametersCommerceUpdateComponent,
        ParametersCommerceDeleteDialogComponent,
        ParametersCommerceDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolParametersCommerceModule {}
