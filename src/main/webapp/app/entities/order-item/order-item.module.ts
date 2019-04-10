import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TrebolSharedModule } from 'app/shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    OrderItemComponent,
    OrderItemDetailComponent,
    OrderItemUpdateComponent,
    OrderItemDeletePopupComponent,
    OrderItemDeleteDialogComponent,
    OrderItemUpdatePopupComponent,
    orderItemRoute,
    orderItemPopupRoute
} from './';

const ENTITY_STATES = [...orderItemRoute, ...orderItemPopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES), NgbModule],
    declarations: [
        OrderItemComponent,
        OrderItemDetailComponent,
        OrderItemUpdateComponent,
        OrderItemDeleteDialogComponent,
        OrderItemDeletePopupComponent,
        OrderItemUpdatePopupComponent
    ],
    entryComponents: [
        OrderItemComponent,
        OrderItemUpdateComponent,
        OrderItemDeleteDialogComponent,
        OrderItemDeletePopupComponent,
        OrderItemUpdatePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolOrderItemModule {}
