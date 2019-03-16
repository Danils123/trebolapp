import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AuthorityService } from 'app/entities/authority/authority.service';
import { AuthorityDetailComponent } from 'app/entities/authority/authority-detail.component';
import { AuthorityUpdateComponent } from 'app/entities/authority/authority-update.component';
import { AuthorityDeletePopupComponent } from 'app/entities/authority/authority-delete-dialog.component';
import { Authority, IAuthority } from 'app/shared/model/authority.model';
import { AuthorityComponent } from 'app/entities/authority/authority.component';

@Injectable({ providedIn: 'root' })
export class AuthorityResolve implements Resolve<IAuthority> {
    constructor(private service: AuthorityService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IAuthority> {
        const name = route.params['name'] ? route.params['name'] : null;
        if (name) {
            return this.service.find(name).pipe(
                filter((response: HttpResponse<Authority>) => response.ok),
                map((authority: HttpResponse<Authority>) => authority.body)
            );
        }
        return of(new Authority());
    }
}

export const authorityRoute: Routes = [
    {
        path: '',
        component: AuthorityComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Authorities'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':name/view',
        component: AuthorityDetailComponent,
        resolve: {
            category: AuthorityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Authorities'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: AuthorityUpdateComponent,
        resolve: {
            category: AuthorityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Authorities'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':name/edit',
        component: AuthorityUpdateComponent,
        resolve: {
            category: AuthorityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Authorities'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const authorityPopupRoute: Routes = [
    {
        path: ':name/delete',
        component: AuthorityDeletePopupComponent,
        resolve: {
            category: AuthorityResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Authorities'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
