import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    ProductsPerOrderComponent,
    ProductsPerOrderDetailComponent,
    ProductsPerOrderUpdateComponent,
    ProductsPerOrderDeletePopupComponent,
    ProductsPerOrderDeleteDialogComponent,
    productsPerOrderRoute,
    productsPerOrderPopupRoute
} from './';

const ENTITY_STATES = [...productsPerOrderRoute, ...productsPerOrderPopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProductsPerOrderComponent,
        ProductsPerOrderDetailComponent,
        ProductsPerOrderUpdateComponent,
        ProductsPerOrderDeleteDialogComponent,
        ProductsPerOrderDeletePopupComponent
    ],
    entryComponents: [
        ProductsPerOrderComponent,
        ProductsPerOrderUpdateComponent,
        ProductsPerOrderDeleteDialogComponent,
        ProductsPerOrderDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolProductsPerOrderModule {}
