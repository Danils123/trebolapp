import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RankingPerOrder } from 'app/shared/model/ranking-per-order.model';
import { RankingPerOrderService } from './ranking-per-order.service';
import { RankingPerOrderComponent } from './ranking-per-order.component';
import { RankingPerOrderDetailComponent } from './ranking-per-order-detail.component';
import { RankingPerOrderUpdateComponent } from './ranking-per-order-update.component';
import { RankingPerOrderDeletePopupComponent } from './ranking-per-order-delete-dialog.component';
import { IRankingPerOrder } from 'app/shared/model/ranking-per-order.model';

@Injectable({ providedIn: 'root' })
export class RankingPerOrderResolve implements Resolve<IRankingPerOrder> {
    constructor(private service: RankingPerOrderService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IRankingPerOrder> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<RankingPerOrder>) => response.ok),
                map((rankingPerOrder: HttpResponse<RankingPerOrder>) => rankingPerOrder.body)
            );
        }
        return of(new RankingPerOrder());
    }
}

export const rankingPerOrderRoute: Routes = [
    {
        path: '',
        component: RankingPerOrderComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RankingPerOrders'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: RankingPerOrderDetailComponent,
        resolve: {
            rankingPerOrder: RankingPerOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RankingPerOrders'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: RankingPerOrderUpdateComponent,
        resolve: {
            rankingPerOrder: RankingPerOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RankingPerOrders'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: RankingPerOrderUpdateComponent,
        resolve: {
            rankingPerOrder: RankingPerOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RankingPerOrders'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const rankingPerOrderPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: RankingPerOrderDeletePopupComponent,
        resolve: {
            rankingPerOrder: RankingPerOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'RankingPerOrders'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
