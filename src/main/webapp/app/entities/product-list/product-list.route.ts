import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ProductList } from 'app/shared/model/product-list.model';
import { ProductListService } from './product-list.service';
import { ProductListComponent } from './product-list.component';
import { ProductListDetailComponent } from './product-list-detail.component';
import { ProductListUpdateComponent } from './product-list-update.component';
import { ProductListDeletePopupComponent } from './product-list-delete-dialog.component';
import { IProductList } from 'app/shared/model/product-list.model';
import { ListPurchaseResolve } from 'app/entities/list-purchase';

@Injectable({ providedIn: 'root' })
export class ProductListResolve implements Resolve<IProductList> {
    constructor(private service: ProductListService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductList> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ProductList>) => response.ok),
                map((productList: HttpResponse<ProductList>) => productList.body)
            );
        }
        return of(new ProductList());
    }
}

export const productListRoute: Routes = [
    {
        path: '',
        component: ProductListComponent,
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Lista de productos'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ProductListDetailComponent,
        resolve: {
            productList: ProductListResolve
        },
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Lista de productos'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ProductListUpdateComponent,
        resolve: {
            productList: ProductListResolve
        },
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Lista de productos'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ProductListUpdateComponent,
        resolve: {
            listPurchase: ListPurchaseResolve
        },
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Lista de compras'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const productListPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ProductListDeletePopupComponent,
        resolve: {
            productList: ProductListResolve
        },
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Lista de productos'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
