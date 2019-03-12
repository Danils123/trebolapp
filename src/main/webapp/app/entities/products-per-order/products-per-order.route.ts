import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductsPerOrder } from 'app/shared/model/products-per-order.model';
import { ProductsPerOrderService } from './products-per-order.service';
import { ProductsPerOrderComponent } from './products-per-order.component';
import { ProductsPerOrderDetailComponent } from './products-per-order-detail.component';
import { ProductsPerOrderUpdateComponent } from './products-per-order-update.component';
import { ProductsPerOrderDeletePopupComponent } from './products-per-order-delete-dialog.component';
import { IProductsPerOrder } from 'app/shared/model/products-per-order.model';

@Injectable({ providedIn: 'root' })
export class ProductsPerOrderResolve implements Resolve<IProductsPerOrder> {
    constructor(private service: ProductsPerOrderService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductsPerOrder> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductsPerOrder>) => response.ok),
                map((productsPerOrder: HttpResponse<ProductsPerOrder>) => productsPerOrder.body)
            );
        }
        return of(new ProductsPerOrder());
    }
}

export const productsPerOrderRoute: Routes = [
    {
        path: '',
        component: ProductsPerOrderComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductsPerOrders'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductsPerOrderDetailComponent,
        resolve: {
            productsPerOrder: ProductsPerOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductsPerOrders'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductsPerOrderUpdateComponent,
        resolve: {
            productsPerOrder: ProductsPerOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductsPerOrders'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductsPerOrderUpdateComponent,
        resolve: {
            productsPerOrder: ProductsPerOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductsPerOrders'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productsPerOrderPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductsPerOrderDeletePopupComponent,
        resolve: {
            productsPerOrder: ProductsPerOrderResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ProductsPerOrders'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
