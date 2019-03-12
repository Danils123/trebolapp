import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Commerce } from 'app/shared/model/commerce.model';
import { CommerceService } from './commerce.service';
import { CommerceComponent } from './commerce.component';
import { CommerceDetailComponent } from './commerce-detail.component';
import { CommerceUpdateComponent } from './commerce-update.component';
import { CommerceDeletePopupComponent } from './commerce-delete-dialog.component';
import { ICommerce } from 'app/shared/model/commerce.model';

@Injectable({ providedIn: 'root' })
export class CommerceResolve implements Resolve<ICommerce> {
    constructor(private service: CommerceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICommerce> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Commerce>) => response.ok),
                map((commerce: HttpResponse<Commerce>) => commerce.body)
            );
        }
        return of(new Commerce());
    }
}

export const commerceRoute: Routes = [
    {
        path: '',
        component: CommerceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commerce'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: CommerceDetailComponent,
        resolve: {
            commerce: CommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commerce'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: CommerceUpdateComponent,
        resolve: {
            commerce: CommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commerce'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: CommerceUpdateComponent,
        resolve: {
            commerce: CommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commerce'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const commercePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: CommerceDeletePopupComponent,
        resolve: {
            commerce: CommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Commerce'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
