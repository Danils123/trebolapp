import { Route } from '@angular/router';
import { MapshopComponent } from 'app/mapshop/mapshop.component';

export const MAPSHOP_ROUTE: Route = {
    path: 'mapshop',
    component: MapshopComponent,
    data: {
        authorities: ['ROLE_USER', 'ROLE_COMPRADOR]'],
        pageTitle: 'Mapa'
    }
};
