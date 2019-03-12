import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommerce } from 'app/shared/model/commerce.model';

@Component({
    selector: 'jhi-commerce-detail',
    templateUrl: './commerce-detail.component.html'
})
export class CommerceDetailComponent implements OnInit {
    commerce: ICommerce;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ commerce }) => {
            this.commerce = commerce;
        });
    }

    previousState() {
        window.history.back();
    }
}
