import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import { TextMaskModule } from 'angular2-text-mask';

import { SessionsComponent, ActivateComponent, SettingsComponent, accountState } from './';

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(accountState), TextMaskModule],
    declarations: [ActivateComponent, SessionsComponent, SettingsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolAccountModule {}
