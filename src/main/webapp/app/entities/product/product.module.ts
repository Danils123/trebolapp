import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { TrebolSharedModule } from 'app/shared';
import { FirebaseEnvironment } from './firebase-environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import {
    ProductComponent,
    ProductDetailComponent,
    ProductUpdateComponent,
    ProductDeletePopupComponent,
    ProductDeleteDialogComponent,
    productRoute,
    productPopupRoute
} from './';

const ENTITY_STATES = [...productRoute, ...productPopupRoute];

@NgModule({
    imports: [
        TrebolSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        AngularFireModule.initializeApp(FirebaseEnvironment.firebase),
        AngularFirestoreModule
    ],
    declarations: [
        ProductComponent,
        ProductDetailComponent,
        ProductUpdateComponent,
        ProductDeleteDialogComponent,
        ProductDeletePopupComponent
    ],
    entryComponents: [ProductComponent, ProductUpdateComponent, ProductDeleteDialogComponent, ProductDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolProductModule {}
