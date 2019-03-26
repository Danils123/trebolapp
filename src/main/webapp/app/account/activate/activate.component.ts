import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { LoginModalService } from 'app/core';
import { ActivateService } from './activate.service';
import { MainService } from 'app/layouts/main/main.service';

@Component({
    selector: 'jhi-activate',
    templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit, OnDestroy {
    error: string;
    success: string;
    modalRef: NgbModalRef;

    constructor(
        private activateService: ActivateService,
        private loginModalService: LoginModalService,
        private route: ActivatedRoute,
        private mainService: MainService
    ) {}

    ngOnInit() {
        this.mainService.show();
        this.route.queryParams.subscribe(params => {
            this.activateService.get(params['key']).subscribe(
                () => {
                    this.error = null;
                    this.success = 'OK';
                },
                () => {
                    this.success = null;
                    this.error = 'ERROR';
                }
            );
        });
    }

    ngOnDestroy() {
        this.mainService.hide();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
