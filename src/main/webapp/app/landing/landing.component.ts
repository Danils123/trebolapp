import { Component, OnInit } from '@angular/core';
import { LoginModalService } from 'app/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInUp } from 'ng-animate';
import { LandingService } from './landing.service';

@Component({
    selector: 'jhi-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.scss'],
    animations: [
        trigger('slideInUp', [
            transition(
                '* => *',
                useAnimation(slideInUp, {
                    params: { timing: 0.5, delay: 0 }
                })
            )
        ])
    ]
})
export class LandingComponent implements OnInit {
    modalRef: NgbModalRef;
    slideInUp: any;
    constructor(private loginModalService: LoginModalService, public landingServices: LandingService) {}

    ngOnInit() {}

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
