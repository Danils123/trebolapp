import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { LoginModalService } from 'app/core';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
    modalRef: NgbModalRef;

    constructor(private loginModalService: LoginModalService) {}

    ngOnInit() {}

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
