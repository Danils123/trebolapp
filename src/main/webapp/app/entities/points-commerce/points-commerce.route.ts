import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PointsCommerce } from 'app/shared/model/points-commerce.model';
import { PointsCommerceService } from './points-commerce.service';
import { PointsCommerceComponent } from './points-commerce.component';
import { PointsCommerceDetailComponent } from './points-commerce-detail.component';
import { PointsCommerceUpdateComponent } from './points-commerce-update.component';
import { PointsCommerceDeletePopupComponent } from './points-commerce-delete-dialog.component';
import { IPointsCommerce } from 'app/shared/model/points-commerce.model';

@Injectable({ providedIn: 'root' })
export class PointsCommerceResolve implements Resolve<IPointsCommerce> {
    constructor(private service: PointsCommerceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPointsCommerce> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<PointsCommerce>) => response.ok),
                map((pointsCommerce: HttpResponse<PointsCommerce>) => pointsCommerce.body)
            );
        }
        return of(new PointsCommerce());
    }
}

export const pointsCommerceRoute: Routes = [
    {
        path: '',
        component: PointsCommerceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PointsCommerces'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: PointsCommerceDetailComponent,
        resolve: {
            pointsCommerce: PointsCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PointsCommerces'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: PointsCommerceUpdateComponent,
        resolve: {
            pointsCommerce: PointsCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PointsCommerces'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: PointsCommerceUpdateComponent,
        resolve: {
            pointsCommerce: PointsCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PointsCommerces'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const pointsCommercePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: PointsCommerceDeletePopupComponent,
        resolve: {
            pointsCommerce: PointsCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'PointsCommerces'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
