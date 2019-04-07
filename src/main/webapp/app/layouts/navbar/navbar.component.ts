import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { CommerceUserService } from 'app/entities/commerce-user';
import { IUserExtra } from 'app/shared/model/user-extra.model';

@Component({
    selector: 'jhi-navbar',
    templateUrl: './navbar.component.html',
    styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {
    inProduction: boolean;
    isNavbarCollapsed: boolean;
    languages: any[];
    swaggerEnabled: boolean;
    modalRef: NgbModalRef;
    version: string;
    offers: IOffer[] = [];
    informationArray: Information[] = [];
    eventSubscriber: Subscription;

    constructor(
        private loginService: LoginService,
        public accountService: AccountService,
        private loginModalService: LoginModalService,
        private router: Router,
        private profileService: ProfileService,
        public userExtraService: UserExtraService,
        public commerceService: CommerceService,
        public offerService: OfferService,
        protected eventManager: JhiEventManager,
        public commerceUserService: CommerceUserService
    ) {}

    ngOnInit() {
        this.profileService.getProfileInfo().then(profileInfo => {
            this.inProduction = profileInfo.inProduction;
            this.swaggerEnabled = profileInfo.swaggerEnabled;
        });

        this.registerChangeInOffers();
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
        this.informationArray = [];
        let userExtra: IUserExtra;

        this.userExtraService.find(this.accountService.userExtra.id).subscribe((res: HttpResponse<IUserExtra>) => {
            userExtra = res.body;
            this.commerceUserService
                .findCommercesByUser(userExtra.id)
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
                });
        });
    }

    registerChangeInOffers() {
        this.eventSubscriber = this.eventManager.subscribe('newOffer', response => this.loadInfo());
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }
}

class Information {
    constructor(public commerceId?: number, public commerceName?: string, public offerDescription?: string, public expirationDate?: Date) {}
}
