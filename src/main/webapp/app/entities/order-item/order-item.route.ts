import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderItem } from 'app/shared/model/order-item.model';
import { OrderItemService } from './order-item.service';
import { OrderItemComponent } from './order-item.component';
import { OrderItemDetailComponent, OrderItemUpdatePopupComponent } from './order-item-detail.component';
import { OrderItemUpdateComponent } from './order-item-update.component';
import { OrderItemDeletePopupComponent } from './order-item-delete-dialog.component';
import { IOrderItem } from 'app/shared/model/order-item.model';

@Injectable({ providedIn: 'root' })
export class OrderItemResolve implements Resolve<IOrderItem> {
    constructor(private service: OrderItemService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOrderItem> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<OrderItem>) => response.ok),
                map((orderItem: HttpResponse<OrderItem>) => orderItem.body)
            );
        }
        return of(new OrderItem());
    }
}

export const orderItemRoute: Routes = [
    {
        path: '',
        component: OrderItemComponent,
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'OrderItems'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: OrderItemDetailComponent,
        resolve: {
            orderItem: OrderItemResolve
        },
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'OrderItems'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: OrderItemUpdateComponent,
        resolve: {
            orderItem: OrderItemResolve
        },
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'OrderItems'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const orderItemPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: OrderItemDeletePopupComponent,
        resolve: {
            orderItem: OrderItemResolve
        },
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'OrderItems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: ':id/update',
        component: OrderItemUpdatePopupComponent,
        resolve: {
            orderItem: OrderItemResolve
        },
        data: {
            authorities: ['ROLE_VENDEDOR'],
            pageTitle: 'OrderItems'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
