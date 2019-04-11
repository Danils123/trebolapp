import { Component, OnInit, ElementRef, Renderer, OnDestroy } from '@angular/core';
import { ProductCommerce } from 'app/shared/model/product-commerce.model';
import { NgbActiveModal, ModalDismissReasons, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderItem } from 'app/shared/model/order-item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItemService } from './order-item.service';
import { ProductsPerOrder } from 'app/shared/model/products-per-order.model';

@Component({
    selector: 'jhi-order-item-detail',
    templateUrl: './order-item-detail.component.html'
})
export class OrderItemDetailComponent implements OnInit {
    orderItem: OrderItem[];
    products: ProductsPerOrder[];
    closeResult: string;

    constructor(public activeModal: NgbActiveModal) {}

    ngOnInit() {}
}

@Component({
    selector: 'jhi-order-item-delete-popup',
    template: ''
})
export class OrderItemUpdatePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(
        protected activatedRoute: ActivatedRoute,
        private orderService: OrderItemService,
        protected router: Router,
        protected modalService: NgbModal
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ orderItem }) => {
            console.log(orderItem);
            this.orderService.find(orderItem.id).subscribe(order => {
                console.log(order);
                setTimeout(() => {
                    this.ngbModalRef = this.modalService.open(OrderItemDetailComponent as Component, { size: 'lg', backdrop: 'static' });
                    this.ngbModalRef.componentInstance.orderItem = orderItem;
                    this.ngbModalRef.componentInstance.products = orderItem.productsPerOrders;
                    this.ngbModalRef.result.then(
                        result => {
                            this.router.navigate(['/order-item', { outlets: { popup: null } }]);
                            this.ngbModalRef = null;
                        },
                        reason => {
                            this.router.navigate(['/order-item', { outlets: { popup: null } }]);
                            this.ngbModalRef = null;
                        }
                    );
                }, 0);
            });
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
