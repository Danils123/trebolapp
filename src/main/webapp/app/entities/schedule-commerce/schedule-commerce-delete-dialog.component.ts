import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IScheduleCommerce } from 'app/shared/model/schedule-commerce.model';
import { ScheduleCommerceService } from './schedule-commerce.service';

@Component({
    selector: 'jhi-schedule-commerce-delete-dialog',
    templateUrl: './schedule-commerce-delete-dialog.component.html'
})
export class ScheduleCommerceDeleteDialogComponent {
    scheduleCommerce: IScheduleCommerce;

    constructor(
        protected scheduleCommerceService: ScheduleCommerceService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.scheduleCommerceService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'scheduleCommerceListModification',
                content: 'Deleted an scheduleCommerce'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-schedule-commerce-delete-popup',
    template: ''
})
export class ScheduleCommerceDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ scheduleCommerce }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ScheduleCommerceDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.scheduleCommerce = scheduleCommerce;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/schedule-commerce', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/schedule-commerce', { outlets: { popup: null } }]);
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
