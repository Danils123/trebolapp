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
    constructor(
        protected orderItemService: OrderItemService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected orderModalService: OrderModalService,
        private orderServiceWS: OrdersService,
        private productService: ProductCommerceService,
        private commerceService: CommerceService
    ) {
        this.orderServiceWS.connect();
    }

    loadAll() {
        this.orderItemService
            .findByCommerce(this.accountService.userExtra.commerces[0].id)
            .pipe(
                filter((res: HttpResponse<IOrderItem[]>) => res.ok),
                map((res: HttpResponse<IOrderItem[]>) => res.body)
            )
            .subscribe(
                (res: IOrderItem[]) => {
                    this.orderItems = res.filter(item => item.state !== 2);
                    console.log(this.orderItems);
                    this.orderServiceWS.subscribeSeller();
                    this.orderServiceWS.receive().subscribe(order => {
                        if (!(this.orderItems.filter(x => x.id === order.id).length > 0)) {
                            this.commerceService.queryByCommerce(this.accountService.userExtra.id).subscribe(commerce => {
                                if (commerce.body[0].id === order.commerce.id) {
                                    this.orderItems.push(order);
                                }
                            });
                        }
                    });
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
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
        this.productService
            .query()
            .pipe(
                filter((res: HttpResponse<IProductCommerce[]>) => res.ok),
                map((res: HttpResponse<IProductCommerce[]>) => res.body)
            )
            .subscribe(
                (res: IProductCommerce[]) => {
                    console.log(res);
                    const newOrder = new OrderItem();
                    const productCommerce = new ProductCommerce();
                    productCommerce.price = 100;
                    productCommerce.quantity = 1000;
                    productCommerce.commerce = this.accountService.userExtra.commerces;
                    productCommerce.productLists = res;
                    newOrder.productsPerOrders = [];
                    newOrder.commerce = this.accountService.userExtra.commerces[0];
                    newOrder.commerce.id = 1053;
                    newOrder.state = 0;
                    newOrder.productsPerOrders.push(productCommerce);
                    this.orderServiceWS.sendOrder(newOrder);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    changeState(id: number) {
        this.orderItems.map((order, index, array) => {
            if (order.id === id) {
                order.state += 1;
                console.log(order);
                this.orderItemService.update(order).subscribe(response => {
                    console.log(response);
                    if (order.state === 2) {
                        this.completeOrder(order);
                        this.orderItems.splice(index, 1);
                    }
                });
            }
        });
    }
}
