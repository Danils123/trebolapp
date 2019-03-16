import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { default as swal } from 'sweetalert2';
import { ISubCategory } from 'app/shared/model/sub-category.model';
import { SubCategoryService } from './sub-category.service';

@Component({
    selector: 'jhi-sub-category-delete-dialog',
    templateUrl: './sub-category-delete-dialog.component.html'
})
export class SubCategoryDeleteDialogComponent {
    subCategory: ISubCategory;

    constructor(
        protected subCategoryService: SubCategoryService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager,
        private toastr: ToastrService
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.subCategoryService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'subCategoryListModification',
                content: 'Deleted an subCategory'
            });
            this.toastr.warning('SubCategoria borrada correctamente!');
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sub-category-delete-popup',
    template: ''
})
export class SubCategoryDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ subCategory }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(SubCategoryDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.subCategory = subCategory;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/sub-category', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/sub-category', { outlets: { popup: null } }]);
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
