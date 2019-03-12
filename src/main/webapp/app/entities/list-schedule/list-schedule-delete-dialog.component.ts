import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IListSchedule } from 'app/shared/model/list-schedule.model';
import { ListScheduleService } from './list-schedule.service';

@Component({
    selector: 'jhi-list-schedule-delete-dialog',
    templateUrl: './list-schedule-delete-dialog.component.html'
})
export class ListScheduleDeleteDialogComponent {
    listSchedule: IListSchedule;

    constructor(
        protected listScheduleService: ListScheduleService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.listScheduleService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'listScheduleListModification',
                content: 'Deleted an listSchedule'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-list-schedule-delete-popup',
    template: ''
})
export class ListScheduleDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ listSchedule }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ListScheduleDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.listSchedule = listSchedule;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/list-schedule', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/list-schedule', { outlets: { popup: null } }]);
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
