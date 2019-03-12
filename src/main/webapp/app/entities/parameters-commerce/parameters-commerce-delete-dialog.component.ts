import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IParametersCommerce } from 'app/shared/model/parameters-commerce.model';
import { ParametersCommerceService } from './parameters-commerce.service';

@Component({
    selector: 'jhi-parameters-commerce-delete-dialog',
    templateUrl: './parameters-commerce-delete-dialog.component.html'
})
export class ParametersCommerceDeleteDialogComponent {
    parametersCommerce: IParametersCommerce;

    constructor(
        protected parametersCommerceService: ParametersCommerceService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.parametersCommerceService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'parametersCommerceListModification',
                content: 'Deleted an parametersCommerce'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-parameters-commerce-delete-popup',
    template: ''
})
export class ParametersCommerceDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ parametersCommerce }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ParametersCommerceDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.parametersCommerce = parametersCommerce;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/parameters-commerce', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/parameters-commerce', { outlets: { popup: null } }]);
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
