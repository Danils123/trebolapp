import { Component, OnInit, OnDestroy } from '@angular/core';

import { AccountService } from 'app/core';
import { PasswordService } from './password.service';
import { MainService } from 'app/layouts/main/main.service';

@Component({
    selector: 'jhi-password',
    templateUrl: './password.component.html'
})
export class PasswordComponent implements OnInit, OnDestroy {
    doNotMatch: string;
    error: string;
    success: string;
    account: any;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;

    constructor(private passwordService: PasswordService, private accountService: AccountService, private mainService: MainService) {}

    ngOnInit() {
        this.mainService.show();
        this.accountService.identity().then(account => {
            this.account = account;
        });
    }

    ngOnDestroy() {
        this.mainService.hide();
    }

    changePassword() {
        if (this.newPassword !== this.confirmPassword) {
            this.error = null;
            this.success = null;
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.passwordService.save(this.newPassword, this.currentPassword).subscribe(
                () => {
                    this.error = null;
                    this.success = 'OK';
                },
                () => {
                    this.success = null;
                    this.error = 'ERROR';
                }
            );
        }
    }
}
