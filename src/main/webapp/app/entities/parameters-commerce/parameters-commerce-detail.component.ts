import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParametersCommerce } from 'app/shared/model/parameters-commerce.model';

@Component({
    selector: 'jhi-parameters-commerce-detail',
    templateUrl: './parameters-commerce-detail.component.html'
})
export class ParametersCommerceDetailComponent implements OnInit {
    parametersCommerce: IParametersCommerce;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ parametersCommerce }) => {
            this.parametersCommerce = parametersCommerce;
        });
    }

    previousState() {
        window.history.back();
    }
}
