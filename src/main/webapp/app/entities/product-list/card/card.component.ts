import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { AccountService } from 'app/core';
import { Subscription } from 'rxjs';
import { Ilistpurchaseall } from '../../../shared/model/listpurchaseall.model';
import { IListPurchase } from 'app/shared/model/list-purchase.model';
import { ListPurchaseService } from 'app/entities/list-purchase';

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
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        protected listPurchaseService: ListPurchaseService
    ) {}

    ngOnInit() {}

    deleteItem(listpurchase: IListPurchase) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea eliminar la lista?',
                text: 'Si continúa, no podrá revertir el cambio',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, eliminar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmDelete(listpurchase);
                }
            });
    }
    confirmDelete(listpurchase: IListPurchase) {
        listpurchase.state = false;
        this.listPurchaseService.update(listpurchase).subscribe(response => {
            this.eventManager.broadcast({
                name: 'productListListModification',
                content: 'Deleted an productList'
            });
            this.swalWithBootstrapButtons.fire('Eliminada!', 'La lista ha sido eliminada.', 'success');
        });
    }
}
