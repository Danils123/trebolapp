import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import { LandingComponent, LANDING_ROUTE } from './';

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild([LANDING_ROUTE])],
    declarations: [LandingComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolLandingModule {}
