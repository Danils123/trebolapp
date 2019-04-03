import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { ISubCategory } from 'app/shared/model/sub-category.model';
import { AccountService } from 'app/core';
import { SubCategoryService } from './sub-category.service';
import Swal from 'sweetalert2';
import { ICategory } from 'app/shared/model/category.model';
@Component({
    selector: 'jhi-sub-category',
    templateUrl: './sub-category.component.html'
})
export class SubCategoryComponent implements OnInit, OnDestroy {
    subCategories: ISubCategory[];
    currentAccount: any;
    eventSubscriber: Subscription;
    _filterQuery = '';
    filteredsubCategories: ISubCategory[];

    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });

    constructor(
        protected subCategoryService: SubCategoryService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.subCategoryService
            .query()
            .pipe(
                filter((res: HttpResponse<ISubCategory[]>) => res.ok),
                map((res: HttpResponse<ISubCategory[]>) => res.body)
            )
            .subscribe(
                (res: ISubCategory[]) => {
                    this.subCategories = res;
                    this.filteredsubCategories = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInSubCategories();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ISubCategory) {
        return item.id;
    }

    registerChangeInSubCategories() {
        this.eventSubscriber = this.eventManager.subscribe('subCategoryListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    deleteItem(subCategory: ISubCategory) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea deshabilitar la SubCategoría?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, deshabilitar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmDelete(subCategory);
                }
            });
    }

    confirmDelete(subCategory: ISubCategory) {
        subCategory.disabled = true;
        this.subCategoryService.update(subCategory).subscribe(response => {
            this.eventManager.broadcast({
                name: 'subCategoryListModification',
                content: 'Deleted an subCategory'
            });
            this.swalWithBootstrapButtons.fire('Deshabilitada!', 'La SubCategoría ha sido deshabilitada.', 'success');
        });
    }

    enableItem(subCategory: ISubCategory) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea habilitar la Subcategoría?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, habilitar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmEnable(subCategory);
                }
            });
    }
    confirmEnable(subCategory: ISubCategory) {
        subCategory.disabled = false;
        this.subCategoryService.update(subCategory).subscribe(response => {
            this.eventManager.broadcast({
                name: 'subCategoryListModification',
                content: 'Deleted an subCategory'
            });
            this.swalWithBootstrapButtons.fire('Habilitada!', 'La Subcategoría ha sido habilitada.', 'success');
        });
    }

    get filterQuery(): string {
        return this._filterQuery;
    }

    set filterQuery(value: string) {
        this._filterQuery = value;
        this.filteredsubCategories = this.filterQuery ? this.doFilter(this.filterQuery) : this.subCategories;
    }

    doFilter(filterBy: string): ISubCategory[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.subCategories.filter((subCategory: ISubCategory) => subCategory.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }
}
