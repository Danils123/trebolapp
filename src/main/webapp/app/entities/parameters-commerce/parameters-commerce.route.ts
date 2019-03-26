import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ParametersCommerce } from 'app/shared/model/parameters-commerce.model';
import { ParametersCommerceService } from './parameters-commerce.service';
import { ParametersCommerceComponent } from './parameters-commerce.component';
import { ParametersCommerceDetailComponent } from './parameters-commerce-detail.component';
import { ParametersCommerceUpdateComponent } from './parameters-commerce-update.component';
import { ParametersCommerceDeletePopupComponent } from './parameters-commerce-delete-dialog.component';
import { IParametersCommerce } from 'app/shared/model/parameters-commerce.model';

@Injectable({ providedIn: 'root' })
export class ParametersCommerceResolve implements Resolve<IParametersCommerce> {
    constructor(private service: ParametersCommerceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IParametersCommerce> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ParametersCommerce>) => response.ok),
                map((parametersCommerce: HttpResponse<ParametersCommerce>) => parametersCommerce.body)
            );
        }
        return of(new ParametersCommerce());
    }
}

export const parametersCommerceRoute: Routes = [
    {
        path: '',
        component: ParametersCommerceComponent,
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'Configuración de comercio'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ParametersCommerceDetailComponent,
        resolve: {
            parametersCommerce: ParametersCommerceResolve
        },
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'Configuración de comercio'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ParametersCommerceUpdateComponent,
        resolve: {
            parametersCommerce: ParametersCommerceResolve
        },
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'Configuración de comercio'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ParametersCommerceUpdateComponent,
        resolve: {
            parametersCommerce: ParametersCommerceResolve
        },
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'Configuración de comercio'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const parametersCommercePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ParametersCommerceDeletePopupComponent,
        resolve: {
            parametersCommerce: ParametersCommerceResolve
        },
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'Configuración de comercio'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
