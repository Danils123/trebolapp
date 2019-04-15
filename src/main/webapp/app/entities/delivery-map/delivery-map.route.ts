import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DeliveryMap, IDeliveryMap } from 'app/shared/model/delivery-map.model';
import { DeliveryMapService } from './delivery-map.service';
import { DeliveryMapComponent } from './delivery-map.component';

@Injectable({ providedIn: 'root' })
export class DeliveryMapResolve implements Resolve<IDeliveryMap> {
    constructor(private service: DeliveryMapService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDeliveryMap> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<DeliveryMap>) => response.ok),
                map((deliveryMap: HttpResponse<DeliveryMap>) => deliveryMap.body)
            );
        }
        return of(new DeliveryMap());
    }
}

export const deliveryMapRoute: Routes = [
    {
        path: '',
        component: DeliveryMapComponent,
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Entrega de compra'
        },
        canActivate: [UserRouteAccessService]
    }
];
