import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    ProductListComponent,
    ProductListDetailComponent,
    ProductListUpdateComponent,
    ProductListDeletePopupComponent,
    ProductListDeleteDialogComponent,
    productListRoute,
    productListPopupRoute
} from './';

const ENTITY_STATES = [...productListRoute, ...productListPopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductListComponent,
        ProductListDetailComponent,
        ProductListUpdateComponent,
        ProductListDeleteDialogComponent,
        ProductListDeletePopupComponent
    ],
    entryComponents: [ProductListComponent, ProductListUpdateComponent, ProductListDeleteDialogComponent, ProductListDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolProductListModule {}
