import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRankingPerOrder } from 'app/shared/model/ranking-per-order.model';
import { RankingPerOrderService } from './ranking-per-order.service';

@Component({
    selector: 'jhi-ranking-per-order-delete-dialog',
    templateUrl: './ranking-per-order-delete-dialog.component.html'
})
export class RankingPerOrderDeleteDialogComponent {
    rankingPerOrder: IRankingPerOrder;

    constructor(
        protected rankingPerOrderService: RankingPerOrderService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.rankingPerOrderService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'rankingPerOrderListModification',
                content: 'Deleted an rankingPerOrder'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-ranking-per-order-delete-popup',
    template: ''
})
export class RankingPerOrderDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ rankingPerOrder }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(RankingPerOrderDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.rankingPerOrder = rankingPerOrder;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/ranking-per-order', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/ranking-per-order', { outlets: { popup: null } }]);
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
