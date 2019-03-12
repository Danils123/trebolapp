import { NgModule } from '@angular/core';

import { TrebolSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [TrebolSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [TrebolSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class TrebolSharedCommonModule {}
