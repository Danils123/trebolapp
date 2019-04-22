import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Moment } from 'moment';

import { IOrderItem, OrderItem } from 'app/shared/model/order-item.model';
import { AccountService } from 'app/core';
import { OrderItemService } from './order-item.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OrderModalService } from './order.service';

import { OrdersService } from 'app/core/orders/orders.service';
import { ProductCommerce, IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from '../product-commerce';
import { CommerceService } from '../commerce';
import moment = require('moment');
import { Commerce } from 'app/shared/model/commerce.model';
import { ProductsPerOrder } from 'app/shared/model/products-per-order.model';
import { UserExtraService } from '../user-extra/user-extra.service';

@Component({
    selector: 'jhi-order-item',
    templateUrl: './order-item.component.html',
    styleUrls: ['./order.scss']
})
export class OrderItemComponent implements OnInit, OnDestroy {
    modalRef: NgbModalRef;
    orderItems: IOrderItem[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentCommerce: Commerce;
    constructor(
        protected orderItemService: OrderItemService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected orderModalService: OrderModalService,
        private orderServiceWS: OrdersService,
        private productService: ProductCommerceService,
        private commerceService: CommerceService,
        private userExtraService: UserExtraService
    ) {
        this.orderServiceWS.connect();
        this.accountService.refreshUser();
    }

    loadAll() {
        console.log(this.orderItems);
        this.accountService.fetch().subscribe(user => {
            this.userExtraService.findByUserId(user.body.id).subscribe(userExtra => {
                this.commerceService.queryByCommerce(userExtra.body.id).subscribe(commerce => {
                    this.currentCommerce = commerce.body[0];
                    this.orderItemService
                        .findByCommerce(this.currentCommerce.id)
                        .pipe(
                            filter((res: HttpResponse<IOrderItem[]>) => res.ok),
                            map((res: HttpResponse<IOrderItem[]>) => res.body)
                        )
                        .subscribe(
                            (res: IOrderItem[]) => {
                                this.orderItems = res.filter(item => item.state !== 2);
                                this.orderServiceWS.subscribeSeller();
                                this.orderServiceWS.receive().subscribe(order => {
                                    console.log(order);
                                    if (!(this.orderItems.filter(x => x.id === order.id).length > 0)) {
                                        if (this.currentCommerce.id === order.commerce.id) {
                                            order.date = moment(order.date);
                                            this.orderItems.push(order);
                                        }
                                    }
                                });
                            },
                            (res: HttpErrorResponse) => this.onError(res.message)
                        );
                });
            });
        });
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInOrderItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IOrderItem) {
        return item.id;
    }

    registerChangeInOrderItems() {
        this.eventSubscriber = this.eventManager.subscribe('orderItemListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    detail(products: ProductCommerce) {
        console.log(products);
        this.modalRef = this.orderModalService.open();
    }

    completeOrder(order: OrderItem) {
        this.orderServiceWS.completeOrder(order);
    }

    createOrderDummy() {
        const newOrder = new OrderItem();
        const productPerOrder = new ProductsPerOrder();
        productPerOrder.productCommerce = new ProductCommerce();
        productPerOrder.productCommerce.id = 1351;
        productPerOrder.quantity = 100;
        newOrder.productsPerOrders = [];
        newOrder.commerce = new Commerce();
        newOrder.commerce.id = 1551;
        newOrder.state = 0;
        newOrder.productsPerOrders.push(productPerOrder);
        this.orderServiceWS.sendOrder(newOrder);
    }

    changeState(id: number) {
        this.orderItems.map((order, index, array) => {
            if (order.id === id) {
                order.state += 1;
                this.accountService.fetch().subscribe(user => {
                    this.userExtraService.findByUserId(user.body.id).subscribe(userExtra => {
                        this.commerceService.queryByCommerce(userExtra.body.id).subscribe(commerces => {
                            order.seller.commerces = commerces.body;
                            this.orderItemService.update(order).subscribe(response => {
                                if (order.state === 2) {
                                    this.completeOrder(order);
                                    this.orderItems.splice(index, 1);
                                }
                            });
                        });
                    });
                });
            }
        });
    }
}
