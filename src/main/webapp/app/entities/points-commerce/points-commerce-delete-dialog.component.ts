import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPointsCommerce } from 'app/shared/model/points-commerce.model';
import { PointsCommerceService } from './points-commerce.service';

@Component({
    selector: 'jhi-points-commerce-delete-dialog',
    templateUrl: './points-commerce-delete-dialog.component.html'
})
export class PointsCommerceDeleteDialogComponent {
    pointsCommerce: IPointsCommerce;

    constructor(
        protected pointsCommerceService: PointsCommerceService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.pointsCommerceService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'pointsCommerceListModification',
                content: 'Deleted an pointsCommerce'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-points-commerce-delete-popup',
    template: ''
})
export class PointsCommerceDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ pointsCommerce }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PointsCommerceDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.pointsCommerce = pointsCommerce;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/points-commerce', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/points-commerce', { outlets: { popup: null } }]);
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
