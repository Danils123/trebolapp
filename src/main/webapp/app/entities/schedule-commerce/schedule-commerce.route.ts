import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ScheduleCommerce } from 'app/shared/model/schedule-commerce.model';
import { ScheduleCommerceService } from './schedule-commerce.service';
import { ScheduleCommerceComponent } from './schedule-commerce.component';
import { ScheduleCommerceDetailComponent } from './schedule-commerce-detail.component';
import { ScheduleCommerceUpdateComponent } from './schedule-commerce-update.component';
import { ScheduleCommerceDeletePopupComponent } from './schedule-commerce-delete-dialog.component';
import { IScheduleCommerce } from 'app/shared/model/schedule-commerce.model';

@Injectable({ providedIn: 'root' })
export class ScheduleCommerceResolve implements Resolve<IScheduleCommerce> {
    constructor(private service: ScheduleCommerceService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IScheduleCommerce> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ScheduleCommerce>) => response.ok),
                map((scheduleCommerce: HttpResponse<ScheduleCommerce>) => scheduleCommerce.body)
            );
        }
        return of(new ScheduleCommerce());
    }
}

export const scheduleCommerceRoute: Routes = [
    {
        path: '',
        component: ScheduleCommerceComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ScheduleCommerces'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ScheduleCommerceDetailComponent,
        resolve: {
            scheduleCommerce: ScheduleCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ScheduleCommerces'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ScheduleCommerceUpdateComponent,
        resolve: {
            scheduleCommerce: ScheduleCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ScheduleCommerces'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ScheduleCommerceUpdateComponent,
        resolve: {
            scheduleCommerce: ScheduleCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ScheduleCommerces'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const scheduleCommercePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ScheduleCommerceDeletePopupComponent,
        resolve: {
            scheduleCommerce: ScheduleCommerceResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ScheduleCommerces'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
