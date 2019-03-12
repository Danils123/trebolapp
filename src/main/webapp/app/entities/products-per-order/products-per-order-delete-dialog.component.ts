import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductsPerOrder } from 'app/shared/model/products-per-order.model';
import { ProductsPerOrderService } from './products-per-order.service';

@Component({
    selector: 'jhi-products-per-order-delete-dialog',
    templateUrl: './products-per-order-delete-dialog.component.html'
})
export class ProductsPerOrderDeleteDialogComponent {
    productsPerOrder: IProductsPerOrder;

    constructor(
        protected productsPerOrderService: ProductsPerOrderService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productsPerOrderService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productsPerOrderListModification',
                content: 'Deleted an productsPerOrder'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-products-per-order-delete-popup',
    template: ''
})
export class ProductsPerOrderDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productsPerOrder }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ProductsPerOrderDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.productsPerOrder = productsPerOrder;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/products-per-order', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/products-per-order', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
