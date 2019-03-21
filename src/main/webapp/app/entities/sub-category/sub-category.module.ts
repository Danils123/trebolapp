import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import { FormsModule } from '@angular/forms';
import { DataFilterPipe } from './datafilterpipe';
import {
    SubCategoryComponent,
    SubCategoryDetailComponent,
    SubCategoryUpdateComponent,
    SubCategoryDeletePopupComponent,
    SubCategoryDeleteDialogComponent,
    subCategoryRoute,
    subCategoryPopupRoute
} from './';

const ENTITY_STATES = [...subCategoryRoute, ...subCategoryPopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES), FormsModule],
    declarations: [
        SubCategoryComponent,
        SubCategoryDetailComponent,
        SubCategoryUpdateComponent,
        SubCategoryDeleteDialogComponent,
        SubCategoryDeletePopupComponent,
        DataFilterPipe
    ],
    entryComponents: [SubCategoryComponent, SubCategoryUpdateComponent, SubCategoryDeleteDialogComponent, SubCategoryDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolSubCategoryModule {}
