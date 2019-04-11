import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICommerceUser } from 'app/shared/model/commerce-user.model';
import { CommerceUserService } from './commerce-user.service';

@Component({
    selector: 'jhi-commerce-user-delete-dialog',
    templateUrl: './commerce-user-delete-dialog.component.html'
})
export class CommerceUserDeleteDialogComponent {
    commerceUser: ICommerceUser;

    constructor(
        protected commerceUserService: CommerceUserService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.commerceUserService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'commerceUserListModification',
                content: 'Deleted an commerceUser'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-commerce-user-delete-popup',
    template: ''
})
export class CommerceUserDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ commerceUser }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CommerceUserDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.commerceUser = commerceUser;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/commerce-user', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/commerce-user', { outlets: { popup: null } }]);
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
