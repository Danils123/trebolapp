import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from './commerce.service';

@Component({
    selector: 'jhi-commerce-delete-dialog',
    templateUrl: './commerce-delete-dialog.component.html'
})
export class CommerceDeleteDialogComponent {
    commerce: ICommerce;

    constructor(protected commerceService: CommerceService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.commerceService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'commerceListModification',
                content: 'Deleted an commerce'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-commerce-delete-popup',
    template: ''
})
export class CommerceDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ commerce }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CommerceDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.commerce = commerce;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/commerce', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/commerce', { outlets: { popup: null } }]);
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
