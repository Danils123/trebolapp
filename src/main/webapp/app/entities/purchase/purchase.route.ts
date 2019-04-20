import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Purchase } from 'app/shared/model/purchase.model';
import { PurchaseService } from './purchase.service';
import { PurchaseComponent } from './purchase.component';
import { IPurchase } from 'app/shared/model/purchase.model';

@Injectable({ providedIn: 'root' })
export class PurchaseResolve implements Resolve<IPurchase> {
    constructor(private service: PurchaseService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPurchase> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Purchase>) => response.ok),
                map((purchase: HttpResponse<Purchase>) => purchase.body)
            );
        }
        return of(new Purchase());
    }
}

export const purchaseRoute: Routes = [
    {
        path: ':id',
        component: PurchaseComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Compras'
        },
        canActivate: [UserRouteAccessService]
    }
];
