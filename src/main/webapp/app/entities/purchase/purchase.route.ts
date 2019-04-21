import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { PurchaseComponent } from './purchase.component';

export const purchaseRoute: Routes = [
    {
        path: ':id',
        component: PurchaseComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_COMPRADOR'],
            pageTitle: 'Compras'
        },
        canActivate: [UserRouteAccessService]
    }
];
