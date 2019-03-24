import { Component, OnInit, AfterViewInit, Renderer, ElementRef, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/shared';
import { LoginModalService } from 'app/core';
import { Register } from './register.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { LandingService } from 'app/landing/landing.service';

@Component({
    selector: 'jhi-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    animations: [trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))])]
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
    confirmPassword: string;
    doNotMatch: string;
    error: string;
    errorEmailExists: string;
    errorUserExists: string;
    registerAccount: any;
    success: boolean;
    modalRef: NgbModalRef;
    rolActive = 0;
    fadeIn: any;

    constructor(
        private loginModalService: LoginModalService,
        private registerService: Register,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private router: Router,
        private toastr: ToastrService,
        private landingPageService: LandingService
    ) {
        this.registerService.show();
    }

    ngOnInit() {
        this.success = false;
        this.registerAccount = {};
        this.landingPageService.hide();
        // this.sidebar.hide();
    }

    ngOnDestroy(): void {
        this.landingPageService.show();
        this.registerService.hide();
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#login'), 'focus', []);
    }

    register() {
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.error = null;
            this.errorUserExists = null;
            this.errorEmailExists = null;
            this.registerAccount.langKey = 'en';
            this.registerAccount.rolNumber = this.rolActive;
            this.registerService.save(this.registerAccount).subscribe(
                () => {
                    this.success = true;
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    Toast.fire({
                        type: 'success',
                        title: 'Se ha registrado exitosamente, favor revise su correo'
                    });
                    this.router.navigate(['/']);
                },
                response => this.processError(response)
            );
        }
    }

    openLogin() {
        this.modalRef = this.loginModalService.open();
    }

    cambiarRol(rol: number) {
        this.rolActive = rol;
    }

    private processError(response: HttpErrorResponse) {
        this.success = null;
        if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
            this.errorEmailExists = 'ERROR';
        } else {
            this.error = 'ERROR';
        }
    }
}
