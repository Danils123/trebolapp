import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICategory } from 'app/shared/model/category.model';
import { AccountService } from 'app/core';
import { CategoryService } from './category.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'jhi-category',
    templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit, OnDestroy {
    categories: ICategory[];
    currentAccount: any;
    eventSubscriber: Subscription;
    _filterQuery = '';
    filteredCategories: ICategory[];

    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });
    constructor(
        protected categoryService: CategoryService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.categoryService
            .query()
            .pipe(
                filter((res: HttpResponse<ICategory[]>) => res.ok),
                map((res: HttpResponse<ICategory[]>) => res.body)
            )
            .subscribe(
                (res: ICategory[]) => {
                    this.categories = res;
                    this.filteredCategories = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCategories();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICategory) {
        return item.id;
    }

    registerChangeInCategories() {
        this.eventSubscriber = this.eventManager.subscribe('categoryListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    deleteItem(category: ICategory) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea deshabilitar la categoría?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, deshabilitar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmDelete(category);
                }
            });
    }
    confirmDelete(category: ICategory) {
        category.disabled = true;
        this.categoryService.update(category).subscribe(response => {
            this.eventManager.broadcast({
                name: 'categoryListModification',
                content: 'Deleted an category'
            });
            this.swalWithBootstrapButtons.fire('Deshabilitada!', 'La categoría ha sido deshabilitada.', 'success');
        });
    }

    enableItem(category: ICategory) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea habilitar la categoría?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, habilitar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmEnable(category);
                }
            });
    }
    confirmEnable(category: ICategory) {
        category.disabled = false;
        this.categoryService.update(category).subscribe(response => {
            this.eventManager.broadcast({
                name: 'categoryListModification',
                content: 'Deleted an offer'
            });
            this.swalWithBootstrapButtons.fire('Habilitada!', 'La categoría ha sido habilitada.', 'success');
        });
    }

    get filterQuery(): string {
        return this._filterQuery;
    }

    set filterQuery(value: string) {
        this._filterQuery = value;
        this.filteredCategories = this.filterQuery ? this.doFilter(this.filterQuery) : this.categories;
    }

    doFilter(filterBy: string): ICategory[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.categories.filter((subCategory: ICategory) => subCategory.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }
}
