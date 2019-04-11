import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgDatepickerModule } from 'ng2-datepicker';
import { TrebolSharedModule } from 'app/shared';
import {
    OfferComponent,
    OfferDetailComponent,
    OfferUpdateComponent,
    OfferDeletePopupComponent,
    OfferDeleteDialogComponent,
    offerRoute,
    offerPopupRoute
} from './';

const ENTITY_STATES = [...offerRoute, ...offerPopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES), NgDatepickerModule],
    declarations: [OfferComponent, OfferDetailComponent, OfferUpdateComponent, OfferDeleteDialogComponent, OfferDeletePopupComponent],
    entryComponents: [OfferComponent, OfferUpdateComponent, OfferDeleteDialogComponent, OfferDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolOfferModule {}
