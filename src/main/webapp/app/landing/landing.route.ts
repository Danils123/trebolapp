import { Route } from '@angular/router';
import { LandingComponent } from './landing.component';

export const LANDING_ROUTE: Route = {
    path: 'Home',
    component: LandingComponent,
    data: {
        authorities: [],
        pageTitle: 'Bienvenido a trebol'
    }
};
