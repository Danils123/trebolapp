import { Route } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { PaymentsComponent } from './';

export const PAYMENTS_ROUTE: Route = {
    path: 'payments',
    component: PaymentsComponent,
    data: {
        authorities: ['ROLE_USER', 'ROLE_COMPRADOR'],
        pageTitle: 'Pago'
    }
};
