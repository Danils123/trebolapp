import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';

import { IPurchase } from 'app/shared/model/purchase.model';
import { AccountService } from 'app/core';

import { ITEMS_PER_PAGE } from 'app/shared';
import { PurchaseService } from './purchase.service';
import { DeliveryMapService } from '../delivery-map';
import { OrdersService } from 'app/core/orders/orders.service';
import { OrderItem } from 'app/shared/model/order-item.model';
import { ProductsPerOrder } from 'app/shared/model/products-per-order.model';
import { ProductCommerce } from 'app/shared/model/product-commerce.model';
import { Commerce } from 'app/shared/model/commerce.model';
import { PurchaseSummaryService } from '../purchase-summary/purchase-summary.service';
import { ProductShop } from 'app/shared/model/ProductShop.model';
import { MapshopService } from 'app/mapshop/mapshop.service';

@Component({
    selector: 'jhi-purchase',
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.scss']
})
export class PurchaseComponent implements OnInit, OnDestroy {
    currentAccount: any;
    eventSubscriber: Subscription;
    routeData: any;
    totalItems: any;
    idList: number;
    isHomeDelivery: boolean;
    productShop: ProductShop;
    // Los estados de los diferentes componentes de la compra
    statePayment = false;
    stateDelivery = false;
    stateSummary = false;

    constructor(
        protected purchaseService: PurchaseService,
        protected parseLinks: JhiParseLinks,
        protected jhiAlertService: JhiAlertService,
        protected accountService: AccountService,
        protected activatedRoute: ActivatedRoute,
        protected router: Router,
        protected eventManager: JhiEventManager,
        private orderServiceWS: OrdersService,
        private deliveryService: DeliveryMapService,
        private summaryService: PurchaseSummaryService,
        private mapShopService: MapshopService
    ) {
        this.orderServiceWS.connect();
        this.productShop = null;
    }

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.routeData = this.activatedRoute.params.subscribe(params => {
            this.idList = params['id'];
            this.mapShopService.enterIdList(this.idList);
            console.log('id lista', this.idList);
        });

        // Segmento para subscribir los diferentes estado de los componentes de compras
        this.deliveryService.stateEmitter.subscribe(state => {
            this.stateDelivery = state;
            console.log(this.stateDelivery);
        });

        this.mapShopService.informationEmitter.subscribe(productShop => {
            this.productShop = productShop;
        });
    }

    toDelivery() {
        this.statePayment = true;
        this.deliveryService.enterCoordinates([
            new google.maps.LatLng(9.9323215, -84.0332226),
            new google.maps.LatLng(9.930858, -84.033738)
        ]);
        this.orderServiceWS.subscribeBuyer();
        this.orderServiceWS.receive().subscribe(order => {
            this.deliveryService.initDelivery();
        });
        this.createOrderDummy();
    }

    toFinish() {
        this.orderServiceWS.unsubscribe();
    }

    createOrderDummy() {
        const newOrder = new OrderItem();
        const productPerOrder = new ProductsPerOrder();
        productPerOrder.productCommerce = new ProductCommerce();
        productPerOrder.productCommerce.id = 1300;
        productPerOrder.quantity = 100;
        newOrder.productsPerOrders = [];
        newOrder.commerce = new Commerce();
        newOrder.commerce.id = 1051;
        newOrder.state = 0;
        newOrder.productsPerOrders.push(productPerOrder);
        this.orderServiceWS.sendOrder(newOrder);
    }

    toPayment() {}

    toSummary() {
        this.summaryService.isHomeDeliveryEmitter.subscribe(state => {
            this.isHomeDelivery = state;
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
