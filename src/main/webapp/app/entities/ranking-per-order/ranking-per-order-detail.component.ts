import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRankingPerOrder } from 'app/shared/model/ranking-per-order.model';

@Component({
    selector: 'jhi-ranking-per-order-detail',
    templateUrl: './ranking-per-order-detail.component.html'
})
export class RankingPerOrderDetailComponent implements OnInit {
    rankingPerOrder: IRankingPerOrder;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ rankingPerOrder }) => {
            this.rankingPerOrder = rankingPerOrder;
        });
    }

    previousState() {
        window.history.back();
    }
}
