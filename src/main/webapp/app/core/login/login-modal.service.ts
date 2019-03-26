import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JhiLoginModalComponent } from 'app/shared/login/login.component';
import { LandingService } from 'app/landing/landing.service';
import { UserExtraService } from 'app/entities/user-extra';
import { AccountService } from '../auth/account.service';

@Injectable({ providedIn: 'root' })
export class LoginModalService {
    private isOpen = false;
    constructor(private modalService: NgbModal, private accountService: AccountService) {}

    open(): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
        const modalRef = this.modalService.open(JhiLoginModalComponent);
        modalRef.result.then(
            result => {
                this.isOpen = false;
                // this.userExtraServices.refreshUser();
                this.accountService.refreshUser();
            },
            reason => {
                this.isOpen = false;
                // this.userExtraServices.refreshUser();
                this.accountService.refreshUser();
            }
        );
        return modalRef;
    }
}
