import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ListSchedule } from 'app/shared/model/list-schedule.model';
import { ListScheduleService } from './list-schedule.service';
import { ListScheduleComponent } from './list-schedule.component';
import { ListScheduleDetailComponent } from './list-schedule-detail.component';
import { ListScheduleUpdateComponent } from './list-schedule-update.component';
import { ListScheduleDeletePopupComponent } from './list-schedule-delete-dialog.component';
import { IListSchedule } from 'app/shared/model/list-schedule.model';

@Injectable({ providedIn: 'root' })
export class ListScheduleResolve implements Resolve<IListSchedule> {
    constructor(private service: ListScheduleService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IListSchedule> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<ListSchedule>) => response.ok),
                map((listSchedule: HttpResponse<ListSchedule>) => listSchedule.body)
            );
        }
        return of(new ListSchedule());
    }
}

export const listScheduleRoute: Routes = [
    {
        path: '',
        component: ListScheduleComponent,
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Compras programadas'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: ListScheduleDetailComponent,
        resolve: {
            listSchedule: ListScheduleResolve
        },
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Compras programadas'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: ListScheduleUpdateComponent,
        resolve: {
            listSchedule: ListScheduleResolve
        },
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Compras programadas'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: ListScheduleUpdateComponent,
        resolve: {
            listSchedule: ListScheduleResolve
        },
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Compras programadas'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const listSchedulePopupRoute: Routes = [
    {
        path: ':id/delete',
        component: ListScheduleDeletePopupComponent,
        resolve: {
            listSchedule: ListScheduleResolve
        },
        data: {
            authorities: ['ROLE_COMPRADOR'],
            pageTitle: 'Compras programadas'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
