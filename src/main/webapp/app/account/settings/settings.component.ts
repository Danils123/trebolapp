import { Component, OnInit, ɵConsole } from '@angular/core';
import { AccountService, IUser } from 'app/core';
import { TextMaskModule } from 'angular2-text-mask';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from '../../entities/user-extra/user-extra.service';

import Swal from 'sweetalert2';
import emailMask from 'text-mask-addons/dist/emailMask';
import { ToastrService } from 'ngx-toastr';
import { FirebaseService } from 'app/services/firebase.service';
import { NgForm } from '@angular/forms';

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
    userTemp: any;
    ranking: number[];
    withoutRanking: number[];
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
        this.accountService.fetch().subscribe(account => {
            this.userTemp = null;
            this.userTemp = account.body;
            this.userExtraService.findByUserId(account.body.id).subscribe(user => {
                this.settingsAccount = Object.assign(this.userTemp, user.body);
                this.userExtra = user.body;
                this.settingsAccount.userExtraId = user.body.id;
                this.settingsAccount.id = account.body.id;
                this.checked = JSON.parse(this.userExtra.notification);
                this.ranking = new Array(JSON.parse(this.userExtra.notification));
                console.log(JSON.parse(this.userExtra.notification));
                if (this.ranking.length - 5 > 0 && JSON.parse(this.userExtra.notification) != null) {
                    this.withoutRanking = new Array(JSON.parse(this.userExtra.notification) - 5);
                } else {
                    this.withoutRanking = new Array(4);
                }
                console.log(this.withoutRanking);
            });
        });
    }

    save() {
        this.userTemp = {};
        this.userTemp.login = this.settingsAccount.login;
        this.userTemp.firstName = this.settingsAccount.firstName;
        this.userTemp.lastName = this.settingsAccount.lastName;
        this.userTemp.email = this.settingsAccount.email;
        this.accountService.save(this.userTemp).subscribe(
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
                    const userExtra2 = this.userExtra;

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

    validatePhone(form: NgForm) {
        const text = form.form.controls.phoneInput.value;
        const underscore = '_';
        if (text.includes(underscore)) {
            form.form.controls.phoneInput.setErrors({ incorrect: true });
        }
        return form;
    }

    validateSecondaryPhone(form: NgForm) {
        const text = form.form.controls.cellPhoneInput.value;
        const underscore = '_';
        if (text.includes(underscore)) {
            form.form.controls.cellPhoneInput.setErrors({ incorrect: true });
        }
        return form;
    }
}
