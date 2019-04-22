import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiAlertService } from 'ng-jhipster';
import { PurchaseService } from './purchase.service';
import { DeliveryMapService } from '../delivery-map';
import { PurchaseSummaryService } from '../purchase-summary/purchase-summary.service';
import { Purchase } from '../../shared/model/purchase.model';
import { ProductCommerceService } from '../product-commerce';
import { OrderItemService } from '../order-item';

import { PaymentServiceService } from '../../payments/payment-service.service';
import { CommerceUserService } from '../commerce-user/commerce-user.service';
import { CommerceUser } from '../../shared/model/commerce-user.model';
import { IDeliveryMap } from '../../shared/model/delivery-map.model';
import { ProductShop } from 'app/shared/model/ProductShop.model';
import { OrderItem } from 'app/shared/model/order-item.model';
import { AccountService } from 'app/core';
import { OrdersService } from 'app/core/orders/orders.service';
import { MapshopService } from 'app/mapshop/mapshop.service';
import { ProductsPerOrder } from 'app/shared/model/products-per-order.model';
import { ProductCommerce } from 'app/shared/model/product-commerce.model';
import { Commerce } from 'app/shared/model/commerce.model';
import { UserExtra } from '../../shared/model/user-extra.model';

@Component({
    selector: 'jhi-purchase',
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.scss']
})
export class PurchaseComponent implements OnInit, OnDestroy {
    currentAccount: any;
    routeData: any;
    purchase: Purchase;
    totalItems: any;
    idList: number;
    isHomeDelivery: boolean;
    productShop: ProductShop;
    // Los estados de los diferentes componentes de la compra
    statePayment = false;
    stateDelivery = false;
    stateSummary = false;
    stateFinish = false;
    order: OrderItem;
    totalCount: number;
    isSubscribed = true;

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
        private mapShopService: MapshopService,
        private productCommerceService: ProductCommerceService,
        private orderItemService: OrderItemService,
        private paymentService: PaymentServiceService,
        private commerceUser: CommerceUserService
    ) {
        this.orderServiceWS.connect();
        this.productShop = null;
        this.purchase = new Purchase();
        this.purchase.paymentId = -1;
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
            this.summaryService.initProductShop(this.productShop);
        });

        this.paymentService.idEmitter.subscribe(id => {
            this.purchase.paymentId = id;
            this.createOrder();
        });

        this.summaryService.totalEmitter.subscribe(total => {
            this.totalCount = total;
        });
    }

    toDelivery() {
        this.statePayment = true;
        this.deliveryService.enterCoordinates([
            new google.maps.LatLng(this.productShop.commerce.latitude, this.productShop.commerce.longitud),
            new google.maps.LatLng(this.productShop.user.lat, this.productShop.user.lng)
        ]);
        this.orderServiceWS.subscribeBuyer();
        this.orderServiceWS.receive().subscribe(order => {
            this.deliveryService.initDelivery();
        });
        // this.createOrderDummy();
    }

    toFinish() {
        this.stateFinish = true;
        this.commerceUser.findCommercesByUser(this.accountService.userExtra.id).subscribe(result => {
            if (result.body === null) {
                this.isSubscribed = false;
            } else {
                this.isSubscribed = true;
            }
        });
    }

    createOrder() {
        // this.purchase.
        this.order = new OrderItem();
        this.order.seller = new UserExtra();
        this.order.seller.id = this.accountService.userExtra.id;
        this.productCommerceService.queryByCommerceId(this.productShop.commerce.id).subscribe(commerces => {
            const productsComerce = commerces.body;
            this.order.productsPerOrders = [];
            this.productShop.listShop.forEach(item => {
                const productPerOrder = new ProductsPerOrder();
                productPerOrder.productCommerce = productsComerce.filter(x => x.product.id === item.product.id)[0];
                productPerOrder.quantity = item.QtyBuy;
                this.order.productsPerOrders.push(productPerOrder);
                this.updatInventory(productsComerce.filter(x => x.product.id === item.product.id)[0], item.QtyBuy);
            });
            this.order.commerce = this.productShop.commerce;
            this.order.state = 0;
            this.orderItemService.create(this.order).subscribe(orderResult => {
                this.order.id = orderResult.body.id;
                this.orderServiceWS.sendOrder(this.order);
                this.purchase.orderId = this.order.id;
                this.createPurchase();
            });
        });
    }

    updatInventory(productComerce: ProductCommerce, quantity: number) {
        productComerce.quantity = productComerce.quantity - quantity;
        this.productCommerceService.update(productComerce).subscribe(resp => {
            console.log(resp);
        });
    }

    createPurchase() {
        this.purchase.homeDelivery = this.isHomeDelivery;
        this.purchaseService.create(this.purchase).subscribe(response => {
            this.purchase = response.body;
        });
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

    toPayment() {
        this.purchase.state = 'Finalizada';
        this.paymentService.enterAmount(this.totalCount);
    }

    toSummary() {
        this.summaryService.isHomeDeliveryEmitter.subscribe(state => {
            this.isHomeDelivery = state;
        });
    }

    subscription() {
        const subscription: CommerceUser = {
            idCommerce: this.productShop.commerce.id,
            idUser: this.accountService.userExtra.id
        };
        this.commerceUser.create(subscription).subscribe(result => {
            this.eventManager.broadcast({
                name: 'newOffer',
                content: 'Sending New Offer Broadcast'
            });
            this.router.navigate(['/product-list']);
        });
    }

    ngOnDestroy(): void {
        // this.deliveryService.stateEmitter.unsubscribe();

        // this.mapShopService.informationEmitter.unsubscribe();

        // this.paymentService.idEmitter.unsubscribe();

        // this.summaryService.totalEmitter.unsubscribe();

        // this.orderServiceWS.unsubscribe();

       // this.routeData = null;
    }
}
