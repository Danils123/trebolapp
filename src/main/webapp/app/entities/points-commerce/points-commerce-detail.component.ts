import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPointsCommerce } from 'app/shared/model/points-commerce.model';

@Component({
    selector: 'jhi-points-commerce-detail',
    templateUrl: './points-commerce-detail.component.html'
})
export class PointsCommerceDetailComponent implements OnInit {
    pointsCommerce: IPointsCommerce;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ pointsCommerce }) => {
            this.pointsCommerce = pointsCommerce;
        });
    }

    previousState() {
        window.history.back();
    }
}
