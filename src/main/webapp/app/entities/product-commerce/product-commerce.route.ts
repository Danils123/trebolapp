import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from './product-commerce.service';
import { ProductCommerceComponent } from './product-commerce.component';
import { ProductCommerceDetailComponent } from './product-commerce-detail.component';
import { ProductCommerceUpdateComponent } from './product-commerce-update.component';
import { ProductCommerceDeletePopupComponent } from './product-commerce-delete-dialog.component';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';

@Injectable({ providedIn: 'root' })
export class ProductCommerceResolve implements Resolve<IProductCommerce> {
    constructor(private service: ProductCommerceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductCommerce> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductCommerce>) => response.ok),
                map((productCommerce: HttpResponse<ProductCommerce>) => productCommerce.body)
            );
        }
        return of(new ProductCommerce());
    }
}

export const productCommerceRoute: Routes = [
    {
        path: '',
        component: ProductCommerceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductCommerces'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductCommerceDetailComponent,
        resolve: {
            productCommerce: ProductCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductCommerces'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductCommerceUpdateComponent,
        resolve: {
            productCommerce: ProductCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductCommerces'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductCommerceUpdateComponent,
        resolve: {
            productCommerce: ProductCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductCommerces'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productCommercePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductCommerceDeletePopupComponent,
        resolve: {
            productCommerce: ProductCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductCommerces'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
