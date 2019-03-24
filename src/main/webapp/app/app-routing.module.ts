import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute, navbarRoute } from './layouts';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { HOME_ROUTE } from './home';
import { LANDING_ROUTE } from './landing/landing.route';

const LAYOUT_ROUTES = [navbarRoute, HOME_ROUTE, LANDING_ROUTE, ...errorRoute];

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'admin',
                    loadChildren: './admin/admin.module#TrebolAdminModule'
                },
                ...LAYOUT_ROUTES,
                { path: '**', redirectTo: 'Home' }
            ],
            { useHash: true, enableTracing: DEBUG_INFO_ENABLED }
        )
    ],
    exports: [RouterModule]
})
export class TrebolAppRoutingModule {}
