import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import { RegisterComponent, registerRoute } from './';
@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild([registerRoute])],
    declarations: [RegisterComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolRegisterModule {}
