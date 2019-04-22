import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPurchaseSummary } from 'app/shared/model/purchase-summary.model';
import { AccountService } from 'app/core';
import { PurchaseSummaryService } from './purchase-summary.service';
import { ProductShop } from 'app/shared/model/ProductShop.model';
import { OfferService } from '../offer/offer.service';
import { IOffer, Offer } from '../../shared/model/offer.model';
import { Commerce } from '../../shared/model/commerce.model';

@Component({
    selector: 'jhi-purchase-summary',
    templateUrl: './purchase-summary.component.html'
})
export class PurchaseSummaryComponent implements OnInit {
    purchaseSummaries: IPurchaseSummary[];
    currentAccount: any;
    eventSubscriber: Subscription;
    isHomeDelivery: boolean;
    productShop: ProductShop;
    totalCount: number;
    offer: IOffer;
    costDevelery = 5000;
    origin: string;
    destionation: string;
    constructor(
        protected purchaseSummaryService: PurchaseSummaryService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        private offerService: OfferService
    ) {
        this.productShop = null;
        this.totalCount = 0;
        this.offer = new Offer();
        this.offer.description = '';
        this.offer.discount = 0;
        this.currentAccount = {};
        this.currentAccount.login = 'Cargando';
        this.currentAccount.email = 'Cargando';
        this.productShop = new ProductShop();
        this.productShop.commerce = new Commerce();
    }

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });

        this.purchaseSummaryService.productShopEmitter.subscribe(product => {
            this.productShop = product;
            this.productShop.listShop.forEach(item => {
                this.totalCount += item.price * item.QtyBuy;
            });

            this.offerService.findByCommerce(this.productShop.commerce.id).subscribe(offer => {
                if (offer.body[0] != null) {
                    this.offer = offer.body[0];
                    this.purchaseSummaryService.sendTotal(this.totalCount - this.totalCount * (this.offer.discount / 100));
                } else {
                    this.purchaseSummaryService.sendTotal(this.totalCount);
                }
            });

            this.getOrigingDestination();
        });
    }

    getOrigingDestination() {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
            { location: new google.maps.LatLng(this.productShop.commerce.latitude, this.productShop.commerce.longitud) },
            (results, status) => {
                this.origin = results[0].formatted_address;
            }
        );
        geocoder.geocode({ location: new google.maps.LatLng(this.productShop.user.lat, this.productShop.user.lng) }, (results, status) => {
            this.destionation = results[0].formatted_address;
        });
    }

    //ngOnDestroy() {
         //this.purchaseSummaryService.isHomeDeliveryEmitter.unsubscribe();
         //this.purchaseSummaryService.productShopEmitter.unsubscribe();
        // this.purchaseSummaryService.totalEmitter.unsubscribe();
    //}

    trackId(index: number, item: IPurchaseSummary) {
        return item.id;
    }

    changeHomeDelivery() {
        this.isHomeDelivery = !this.isHomeDelivery;
        if (this.offer !== undefined) {
            this.totalCount += this.isHomeDelivery ? this.costDevelery : 0;
            this.totalCount -= !this.isHomeDelivery ? this.costDevelery : 0;
            this.purchaseSummaryService.sendTotal(this.totalCount - this.totalCount * (this.offer.discount / 100));
        }
        this.purchaseSummaryService.initHomeDelivery(this.isHomeDelivery);
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
