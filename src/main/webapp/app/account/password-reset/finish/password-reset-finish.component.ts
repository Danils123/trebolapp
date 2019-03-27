import { Component, OnInit, AfterViewInit, Renderer, ElementRef, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { LoginModalService, AccountService } from 'app/core';
import { PasswordResetFinishService } from './password-reset-finish.service';
import { MainService } from 'app/layouts/main/main.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { trigger, transition, useAnimation } from '@angular/animations';

@Component({
    selector: 'jhi-password-reset-finish',
    templateUrl: './password-reset-finish.component.html'
})
export class PasswordResetFinishComponent implements OnInit, AfterViewInit, OnDestroy {
    confirmPassword: string;
    doNotMatch: string;
    error: string;
    keyMissing: boolean;
    resetAccount: any;
    success: string;
    modalRef: NgbModalRef;
    key: string;

    constructor(
        private passwordResetFinishService: PasswordResetFinishService,
        private loginModalService: LoginModalService,
        private route: ActivatedRoute,
        private router: Router,
        private elementRef: ElementRef,
        private renderer: Renderer,
        private mainService: MainService
    ) {}

    ngOnInit() {
        this.mainService.show();
        this.route.queryParams.subscribe(params => {
            this.key = params['key'];
        });
        this.resetAccount = {};
        this.keyMissing = !this.key;
    }

    ngOnDestroy() {
        this.mainService.hide();
    }

    ngAfterViewInit() {
        if (this.elementRef.nativeElement.querySelector('#password') != null) {
            this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#password'), 'focus', []);
        }
    }

    finishReset() {
        this.doNotMatch = null;
        this.error = null;
        if (this.resetAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            this.passwordResetFinishService.save({ key: this.key, newPassword: this.resetAccount.password }).subscribe(
                () => {
                    this.success = 'OK';
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    Toast.fire({
                        type: 'success',
                        title: 'Se cambio con éxito su contraseña'
                    });
                    setTimeout(() => {
                        this.router.navigate(['/']);
                    }, 3000);
                },
                () => {
                    this.success = null;
                    this.error = 'ERROR';
                }
            );
        }
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
