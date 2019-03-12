import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ListPurchase } from 'app/shared/model/list-purchase.model';
import { ListPurchaseService } from './list-purchase.service';
import { ListPurchaseComponent } from './list-purchase.component';
import { ListPurchaseDetailComponent } from './list-purchase-detail.component';
import { ListPurchaseUpdateComponent } from './list-purchase-update.component';
import { ListPurchaseDeletePopupComponent } from './list-purchase-delete-dialog.component';
import { IListPurchase } from 'app/shared/model/list-purchase.model';

@Injectable({ providedIn: 'root' })
export class ListPurchaseResolve implements Resolve<IListPurchase> {
    constructor(private service: ListPurchaseService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IListPurchase> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ListPurchase>) => response.ok),
                map((listPurchase: HttpResponse<ListPurchase>) => listPurchase.body)
            );
        }
        return of(new ListPurchase());
    }
}

export const listPurchaseRoute: Routes = [
    {
        path: '',
        component: ListPurchaseComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ListPurchases'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ListPurchaseDetailComponent,
        resolve: {
            listPurchase: ListPurchaseResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ListPurchases'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ListPurchaseUpdateComponent,
        resolve: {
            listPurchase: ListPurchaseResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ListPurchases'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ListPurchaseUpdateComponent,
        resolve: {
            listPurchase: ListPurchaseResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ListPurchases'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const listPurchasePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ListPurchaseDeletePopupComponent,
        resolve: {
            listPurchase: ListPurchaseResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ListPurchases'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
