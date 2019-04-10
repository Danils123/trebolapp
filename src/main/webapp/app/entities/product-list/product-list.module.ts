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
import { CardComponent } from './card/card.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgDatepickerModule } from 'ng2-datepicker';

const ENTITY_STATES = [...productListRoute, ...productListPopupRoute];

@NgModule({
    imports: [
        TrebolSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgDatepickerModule
    ],
    declarations: [
        ProductListComponent,
        ProductListDetailComponent,
        ProductListUpdateComponent,
        ProductListDeleteDialogComponent,
        ProductListDeletePopupComponent,
        CardComponent
    ],
    entryComponents: [ProductListComponent, ProductListUpdateComponent, ProductListDeleteDialogComponent, ProductListDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolProductListModule {}
