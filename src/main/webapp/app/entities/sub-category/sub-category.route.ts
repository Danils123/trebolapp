import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SubCategory } from 'app/shared/model/sub-category.model';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryComponent } from './sub-category.component';
import { SubCategoryDetailComponent } from './sub-category-detail.component';
import { SubCategoryUpdateComponent } from './sub-category-update.component';
import { SubCategoryDeletePopupComponent } from './sub-category-delete-dialog.component';
import { ISubCategory } from 'app/shared/model/sub-category.model';

@Injectable({ providedIn: 'root' })
export class SubCategoryResolve implements Resolve<ISubCategory> {
    constructor(private service: SubCategoryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ISubCategory> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<SubCategory>) => response.ok),
                map((subCategory: HttpResponse<SubCategory>) => subCategory.body)
            );
        }
        return of(new SubCategory());
    }
}

export const subCategoryRoute: Routes = [
    {
        path: '',
        component: SubCategoryComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SubCategories'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: SubCategoryDetailComponent,
        resolve: {
            subCategory: SubCategoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SubCategories'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: SubCategoryUpdateComponent,
        resolve: {
            subCategory: SubCategoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SubCategories'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: SubCategoryUpdateComponent,
        resolve: {
            subCategory: SubCategoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SubCategories'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const subCategoryPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: SubCategoryDeletePopupComponent,
        resolve: {
            subCategory: SubCategoryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'SubCategories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
