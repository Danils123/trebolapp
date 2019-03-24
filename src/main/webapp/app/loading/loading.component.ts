import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from './loading.service';
@Component({
    selector: 'jhi-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.scss']
})
export class LoadingComponent implements OnInit {
    loading: boolean = false;
    loadingSubscription: Subscription;
    constructor(private loadingService: LoadingService) {}

    ngOnInit() {
        this.loadingSubscription = this.loadingService.loadingStatus.subscribe((value: boolean) => {
            this.loading = value;
        });
    }
}
