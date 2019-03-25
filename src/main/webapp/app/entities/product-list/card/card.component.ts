import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ProductListService } from 'app/entities/product-list';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { AccountService } from 'app/core';
import { Subscription } from 'rxjs';
import { Ilistpurchaseall } from 'app/shared/model/listpurchaseall.model';

@Component({
    selector: 'jhi-card',
    templateUrl: './card.component.html',
    styles: []
})
export class CardComponent implements OnInit {
    @Input() listpurchaseAll: Ilistpurchaseall;
    currentAccount: any;
    eventSubscriber: Subscription;

    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });

    constructor(
        protected productListService: ProductListService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    ngOnInit() {}

    deleteItem(id: number) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea eliminar el producto?',
                text: 'Si continúa, no podrá revertir el cambio',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmDelete(id);
                }
            });
    }
    confirmDelete(id: number) {
        this.productListService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productListListModification',
                content: 'Deleted an productList'
            });
            this.swalWithBootstrapButtons.fire('Eliminada!', 'La lista ha sido eliminada.', 'success');
        });
    }
}
