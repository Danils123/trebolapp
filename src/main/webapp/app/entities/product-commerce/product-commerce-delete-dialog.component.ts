import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from './product-commerce.service';

@Component({
    selector: 'jhi-product-commerce-delete-dialog',
    templateUrl: './product-commerce-delete-dialog.component.html'
})
export class ProductCommerceDeleteDialogComponent {
    productCommerce: IProductCommerce;

    constructor(
        protected productCommerceService: ProductCommerceService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.productCommerceService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productCommerceListModification',
                content: 'Deleted an productCommerce'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-product-commerce-delete-popup',
    template: ''
})
export class ProductCommerceDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ productCommerce }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ProductCommerceDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.productCommerce = productCommerce;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/product-commerce', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/product-commerce', { outlets: { popup: null } }]);
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
