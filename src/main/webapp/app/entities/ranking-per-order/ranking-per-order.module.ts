import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TrebolSharedModule } from 'app/shared';
import {
    RankingPerOrderComponent,
    RankingPerOrderDetailComponent,
    RankingPerOrderUpdateComponent,
    RankingPerOrderDeletePopupComponent,
    RankingPerOrderDeleteDialogComponent,
    rankingPerOrderRoute,
    rankingPerOrderPopupRoute
} from './';

const ENTITY_STATES = [...rankingPerOrderRoute, ...rankingPerOrderPopupRoute];

@NgModule({
    imports: [TrebolSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        RankingPerOrderComponent,
        RankingPerOrderDetailComponent,
        RankingPerOrderUpdateComponent,
        RankingPerOrderDeleteDialogComponent,
        RankingPerOrderDeletePopupComponent
    ],
    entryComponents: [
        RankingPerOrderComponent,
        RankingPerOrderUpdateComponent,
        RankingPerOrderDeleteDialogComponent,
        RankingPerOrderDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrebolRankingPerOrderModule {}
