import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TrebolSharedModule } from 'app/shared';
import { RouterModule } from '@angular/router';
import { MAPSHOP_ROUTE } from 'app/mapshop/mapshop.route';
import { MapshopComponent } from 'app/mapshop/mapshop.component';

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild([MAPSHOP_ROUTE])],
    declarations: [MapshopComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [MapshopComponent]
})
export class TrebolMapshopModule {}
