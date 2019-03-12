import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IListSchedule } from 'app/shared/model/list-schedule.model';

@Component({
    selector: 'jhi-list-schedule-detail',
    templateUrl: './list-schedule-detail.component.html'
})
export class ListScheduleDetailComponent implements OnInit {
    listSchedule: IListSchedule;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ listSchedule }) => {
            this.listSchedule = listSchedule;
        });
    }

    previousState() {
        window.history.back();
    }
}
