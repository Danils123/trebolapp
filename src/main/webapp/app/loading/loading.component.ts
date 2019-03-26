import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from './loading.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeOutUp } from 'ng-animate';

@Component({
    selector: 'jhi-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.scss']
})
export class LoadingComponent implements OnInit {
    constructor(public loadingService: LoadingService) {}

    ngOnInit() {}
}
