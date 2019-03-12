import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IScheduleCommerce } from 'app/shared/model/schedule-commerce.model';

@Component({
    selector: 'jhi-schedule-commerce-detail',
    templateUrl: './schedule-commerce-detail.component.html'
})
export class ScheduleCommerceDetailComponent implements OnInit {
    scheduleCommerce: IScheduleCommerce;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ scheduleCommerce }) => {
            this.scheduleCommerce = scheduleCommerce;
        });
    }

    previousState() {
        window.history.back();
    }
}
