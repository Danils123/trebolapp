import { Component, OnInit } from '@angular/core';
import { LoginModalService } from 'app/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInUp } from 'ng-animate';
import { LandingService } from './landing.service';
import { Router } from '@angular/router';
import { Register } from 'app/account/register';

@Component({
    selector: 'jhi-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.scss'],
    animations: [
        trigger('slideInUp', [
            transition(
                '* => *',
                useAnimation(slideInUp, {
                    params: { timing: 0.5, delay: 2.5 }
                })
            )
        ])
    ]
})
export class LandingComponent implements OnInit {
    modalRef: NgbModalRef;
    slideInUp: any;
    constructor(
        private router: Router,
        private loginModalService: LoginModalService,
        public landingServices: LandingService,
        private registerService: Register
    ) {}

    ngOnInit() {
        this.registerService.hide();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    register() {
        this.router.navigate(['register']);
    }
}
