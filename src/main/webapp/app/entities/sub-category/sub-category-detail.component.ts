import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISubCategory } from 'app/shared/model/sub-category.model';

@Component({
    selector: 'jhi-sub-category-detail',
    templateUrl: './sub-category-detail.component.html'
})
export class SubCategoryDetailComponent implements OnInit {
    subCategory: ISubCategory;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ subCategory }) => {
            this.subCategory = subCategory;
        });
    }

    previousState() {
        window.history.back();
    }
}
