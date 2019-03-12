import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IListPurchase } from 'app/shared/model/list-purchase.model';
import { ListPurchaseService } from './list-purchase.service';

@Component({
    selector: 'jhi-list-purchase-delete-dialog',
    templateUrl: './list-purchase-delete-dialog.component.html'
})
export class ListPurchaseDeleteDialogComponent {
    listPurchase: IListPurchase;

    constructor(
        protected listPurchaseService: ListPurchaseService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.listPurchaseService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'listPurchaseListModification',
                content: 'Deleted an listPurchase'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-list-purchase-delete-popup',
    template: ''
})
export class ListPurchaseDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ listPurchase }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ListPurchaseDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.listPurchase = listPurchase;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/list-purchase', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/list-purchase', { outlets: { popup: null } }]);
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
