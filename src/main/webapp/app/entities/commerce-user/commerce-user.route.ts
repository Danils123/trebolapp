import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CommerceUser } from 'app/shared/model/commerce-user.model';
import { CommerceUserService } from './commerce-user.service';
import { CommerceUserComponent } from './commerce-user.component';
import { CommerceUserDetailComponent } from './commerce-user-detail.component';
import { CommerceUserUpdateComponent } from './commerce-user-update.component';
import { CommerceUserDeletePopupComponent } from './commerce-user-delete-dialog.component';
import { ICommerceUser } from 'app/shared/model/commerce-user.model';

@Injectable({ providedIn: 'root' })
export class CommerceUserResolve implements Resolve<ICommerceUser> {
    constructor(private service: CommerceUserService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICommerceUser> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<CommerceUser>) => response.ok),
                map((commerceUser: HttpResponse<CommerceUser>) => commerceUser.body)
            );
        }
        return of(new CommerceUser());
    }
}

export const commerceUserRoute: Routes = [
    {
        path: '',
        component: CommerceUserComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CommerceUsers'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: CommerceUserDetailComponent,
        resolve: {
            commerceUser: CommerceUserResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CommerceUsers'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: CommerceUserUpdateComponent,
        resolve: {
            commerceUser: CommerceUserResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CommerceUsers'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: CommerceUserUpdateComponent,
        resolve: {
            commerceUser: CommerceUserResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CommerceUsers'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const commerceUserPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: CommerceUserDeletePopupComponent,
        resolve: {
            commerceUser: CommerceUserResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'CommerceUsers'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
