import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ISubCategory } from 'app/shared/model/sub-category.model';
import { SubCategoryService } from './sub-category.service';

@Component({
    selector: 'jhi-sub-category-update',
    templateUrl: './sub-category-update.component.html'
})
export class SubCategoryUpdateComponent implements OnInit {
    subCategory: ISubCategory;
    isSaving: boolean;

    constructor(protected subCategoryService: SubCategoryService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ subCategory }) => {
            this.subCategory = subCategory;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.subCategory.id !== undefined) {
            this.subscribeToSaveResponse(this.subCategoryService.update(this.subCategory));
        } else {
            this.subscribeToSaveResponse(this.subCategoryService.create(this.subCategory));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubCategory>>) {
        result.subscribe((res: HttpResponse<ISubCategory>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
