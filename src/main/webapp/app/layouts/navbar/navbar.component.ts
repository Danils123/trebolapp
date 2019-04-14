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
import { OrdersCounterService } from 'app/core/orders/orders_Counter.service';
import { OrderItemService } from 'app/entities/order-item';
import { IOrderItem } from 'app/shared/model/order-item.model';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { CommerceUserService } from 'app/entities/commerce-user';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { Moment } from 'moment';
import { ICategory } from '../../shared/model/category.model';
import moment = require('moment');

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
    offersClicked = false;
    informationArray: Information[] = [];
    eventSubscriber: Subscription;
    momentDate: Moment = moment('12-25-1993', 'MM-DD-YYYY');

    totalOrders: number;

    constructor(
        private loginService: LoginService,
        public accountService: AccountService,
        private loginModalService: LoginModalService,
        private router: Router,
        private profileService: ProfileService,
        public userExtraService: UserExtraService,
        public orderItemService: OrderItemService,
        public commerceService: CommerceService,
        public orderCounter: OrdersCounterService,
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
        if (this.accountService.user !== null && this.accountService.user.authorities.filter(item => item === 'COMPRADOR').length > 0) {
        }
        if (this.accountService.user !== null && this.accountService.user.authorities.filter(item => item === 'VENDEDOR').length > 0) {
            this.loadOrders();
        }
    }

    loadOrders() {
        this.accountService.fetch().subscribe(data => {
            this.userExtraService.findByUserId(data.body.id).subscribe(userExtra => {
                this.commerceService.queryByCommerce(userExtra.body.id).subscribe(comerces => {
                    this.orderItemService
                        .findByCommerce(comerces.body[0].id)
                        .pipe(
                            filter((res: HttpResponse<IOrderItem[]>) => res.ok),
                            map((res: HttpResponse<IOrderItem[]>) => res.body)
                        )
                        .subscribe((res: IOrderItem[]) => {
                            this.totalOrders = res.filter(item => item.state !== 2).length;
                            this.orderCounter.subscribe();
                            this.orderCounter.receive().subscribe(order => {
                                this.commerceService.queryByCommerce(this.accountService.userExtra.id).subscribe(commerce => {
                                    if (commerce.body[0].id === order.commerce.id) {
                                        this.totalOrders++;
                                        const Toast = Swal.mixin({
                                            toast: true,
                                            position: 'top-end',
                                            showConfirmButton: false,
                                            timer: 3000
                                        });
                                        Toast.fire({
                                            type: 'warning',
                                            title: `La order #${order.id} acaba de llegar`
                                        });
                                    }
                                });
                            });
                        });
                });
            });
        });
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

    // This method loads the offers from the commerces for the notifications panel
    loadInfo() {
        this.informationArray = [];
        let userExtra: IUserExtra;
        this.offers = [];

        this.userExtraService.find(this.accountService.userExtra.id).subscribe((res: HttpResponse<IUserExtra>) => {
            userExtra = res.body;
            let offers: IOffer[];
            this.commerceUserService
                .findCommercesByUser(userExtra.id)
                .pipe(
                    filter((res2: HttpResponse<ICommerce[]>) => res2.ok),
                    map((res2: HttpResponse<ICommerce[]>) => res2.body)
                )
                .subscribe((res2: ICommerce[]) => {
                    let informationObject: Information = new Information();
                    const actualDate: Date = new Date();
                    let expirationDate: Date;
                    if (res2 != null) {
                        res2.forEach(commerce => {
                            this.offerService.findByCommerce(commerce.id).subscribe((response: HttpResponse<IOffer[]>) => {
                                offers = response.body;
                                offers.forEach(offer => {
                                    expirationDate = new Date(offer.expirationDate);
                                    if (offer.disabled === false) {
                                        if (offer.expirationDate != null) {
                                            if (expirationDate > actualDate) {
                                                this.offers.push(offer);
                                                informationObject = new Information();
                                                informationObject.commerceName = commerce.name;
                                                informationObject.offerDescription = offer.description;
                                                informationObject.commerceId = commerce.id;
                                                informationObject.expirationDate = offer.expirationDate;
                                                this.informationArray.push(informationObject);
                                            }
                                        } else {
                                            this.offers.push(offer);
                                            informationObject = new Information();
                                            informationObject.commerceName = commerce.name;
                                            informationObject.offerDescription = offer.description;
                                            informationObject.commerceId = commerce.id;
                                            informationObject.expirationDate = offer.expirationDate;
                                            this.informationArray.push(informationObject);
                                        }
                                    }
                                });
                            });
                        });
                    }
                });
        });
    }

    registerChangeInOffers() {
        this.eventSubscriber = this.eventManager.subscribe('newOffer', response => this.loadInfo());
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    offersClickedMethod() {
        this.offersClicked = true;
    }
}

class Information {
    constructor(public commerceId?: number, public commerceName?: string, public offerDescription?: string, public expirationDate?: Date) {}
}
