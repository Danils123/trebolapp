import { Component, OnInit, ɵConsole } from '@angular/core';

import { AccountService, IUser } from 'app/core';
import { TextMaskModule } from 'angular2-text-mask';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from '../../entities/user-extra/user-extra.service';

import Swal from 'sweetalert2';
import emailMask from 'text-mask-addons/dist/emailMask';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from 'app/services/firebase.service';

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html',
    styles: ['./node_modules/ngx-ui-switch/ui-switch.component.css']
})
export class SettingsComponent implements OnInit {
    error: string;
    success: string;
    checked = false;
    settingsAccount: any;
    user: any;
    ranking: number[];
    userExtra: IUserExtra;
    languages: any[];

    public stars: 5;
    public phoneModel = '';
    public phoneMask: Array<string | RegExp>;
    public emailMask = emailMask;
    constructor(
        private accountService: AccountService,
        public textMask: TextMaskModule,
        protected userExtraService: UserExtraService,
        private toastr: ToastrService,
        private firebase: FirebaseService,
        private usuarioExtraService: UserExtraService
    ) {
        this.phoneMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    }

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.userExtraService.findByUserId(account.id).subscribe(user => {
                this.settingsAccount = Object.assign(account, user.body);
                this.user = account;
                this.userExtra = user.body;
                this.settingsAccount.userExtraId = user.body.id;
                this.settingsAccount.id = account.id;
                this.checked = JSON.parse(this.userExtra.notification);
                this.ranking = new Array(JSON.parse(this.userExtra.notification));
            });
        });
    }

    save() {
        this.user = {};
        this.user.login = this.settingsAccount.login;
        this.user.firstName = this.settingsAccount.firstName;
        this.user.lastName = this.settingsAccount.lastName;
        this.user.email = this.settingsAccount.email;
        this.accountService.save(this.user).subscribe(
            () => {
                this.error = null;
                this.accountService.identity(true).then(account => {
                    // this.settingsAccount = this.copyAccount(account);
                    this.userExtra = {};
                    this.userExtra.id = this.settingsAccount.userExtraId;
                    this.userExtra.userId = this.settingsAccount.userId;
                    this.userExtra.secondLastName = this.settingsAccount.secondLastName;
                    this.userExtra.phone = this.settingsAccount.phone;
                    this.userExtra.cellPhone = this.settingsAccount.cellPhone;
                    this.userExtra.address = this.settingsAccount.address;
                    this.userExtra.ranking = this.settingsAccount.ranking;
                    this.userExtra.photograph = this.settingsAccount.photograph;
                    this.userExtra.notification = this.settingsAccount.notification;
                    this.userExtra.commerces = this.settingsAccount.commerces;
                    console.log(this.userExtra);
                    this.userExtraService.update(this.userExtra).subscribe(user => {
                        this.userExtra = user.body;
                        this.success = 'OK';
                        // this.settingsAccount = Object.assign(account, user.body);
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000
                        });
                        Toast.fire({
                            type: 'success',
                            title: 'Se guardo exitosamente su información'
                        });
                        this.usuarioExtraService.refreshUser();
                    });
                });
            },
            () => {
                this.success = null;
                this.error = 'ERROR';
            }
        );
    }

    upload(event) {
        this.firebase.upload(event);
    }

    copyAccount(account) {
        return {
            activated: account.activated,
            email: account.email,
            firstName: account.firstName,
            langKey: account.langKey,
            lastName: account.lastName,
            login: account.login,
            imageUrl: account.imageUrl
        };
    }
}
