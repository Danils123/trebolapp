import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccountService, LoginModalService, LoginService, IUser } from 'app/core';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { Router } from '@angular/router';
import { UserExtraService } from 'app/entities/user-extra';
import { IOffer } from '../../shared/model/offer.model';
import { ICommerce } from '../../shared/model/commerce.model';
import { CommerceService } from 'app/entities/commerce';
import { OfferService } from 'app/entities/offer';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styles: []
})
export class NavbarComponent implements OnInit {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    offers: IOffer[] = [];
    informationArray: Information[] = [];

    constructor(
        private loginService: LoginService,
        public accountService: AccountService,
        private loginModalService: LoginModalService,
        private router: Router,
        private profileService: ProfileService,
        public userExtraService: UserExtraService,
        public commerceService: CommerceService,
        public offerService: OfferService
    ) {}

    ngOnInit() {
        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });

        this.loadInfo();
    }

    isAuthenticated() {
        return this.accountService.isAuthenticated();
    }

    logout() {
        this.loginService.logout();
        this.router.navigate(['']);
    }

    getImageUrl() {
        return this.isAuthenticated() ? this.accountService.getImageUrl() : null;
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    refresh() {
        this.accountService.refreshUser();
    }

    //This method loads the offers from the commerces for the notifications panel
    loadInfo() {
        this.commerceService
            .query()
            .pipe(
                filter((res: HttpResponse<ICommerce[]>) => res.ok),
                map((res: HttpResponse<ICommerce[]>) => res.body)
            )
            .subscribe((res: ICommerce[]) => {
                let informationObject: Information = new Information();
                res.forEach(commerce => {
                    if (commerce.offer != null && commerce.offer !== undefined) {
                        this.offers.push(commerce.offer);
                        informationObject = new Information();
                        informationObject.commerceName = commerce.name;
                        informationObject.offerDescription = commerce.offer.description;
                        informationObject.commerceId = commerce.id;
                        informationObject.expirationDate = commerce.offer.expirationDate;
                        this.informationArray.push(informationObject);
                    }
                });
                console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                console.log(this.informationArray);
            });
    }
}

class Information {
    constructor(public commerceId?: number, public commerceName?: string, public offerDescription?: string, public expirationDate?: Date) {}
}
