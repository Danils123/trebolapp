import { PurchaseSummaryComponent } from './purchase-summary.component';
import { Route } from '@angular/router';

export const purchaseSummaryRoute: Route = {
    path: 'purchaseSummary',
    component: PurchaseSummaryComponent,
    data: {
        authorities: ['ROLE_USER']
    }
};
