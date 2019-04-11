import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOffer } from 'app/shared/model/offer.model';
import { AccountService } from 'app/core';
import { OfferService } from './offer.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'jhi-offer',
    templateUrl: './offer.component.html'
})
export class OfferComponent implements OnInit, OnDestroy {
    offers: IOffer[] = [];
    currentAccount: any;
    eventSubscriber: Subscription;
    _filterQuery = '';
    filteredOffers: IOffer[] = [];
    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });
    constructor(
        protected offerService: OfferService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService
    ) {}

    loadAll() {
        if (this.accountService.userExtra.commerces[0].offer != null && this.accountService.userExtra.commerces[0].offer !== undefined) {
            this.filteredOffers = [];
            this.offers = [];
            this.offers.push(this.accountService.userExtra.commerces[0].offer);
            this.filteredOffers.push(this.accountService.userExtra.commerces[0].offer);
        }
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInOffers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IOffer) {
        return item.id;
    }

    registerChangeInOffers() {
        this.eventSubscriber = this.eventManager.subscribe('offerListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    get filterQuery(): string {
        return this._filterQuery;
    }

    set filterQuery(value: string) {
        this._filterQuery = value;
        this.filteredOffers = this.filterQuery ? this.doFilter(this.filterQuery) : this.offers;
    }

    doFilter(filterBy: string): IOffer[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.offers.filter((offer: IOffer) => offer.description.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    deleteItem(offer: IOffer) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea deshabilitar la oferta?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, deshabilitar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmDelete(offer);
                }
            });
    }
    confirmDelete(offer: IOffer) {
        offer.disabled = true;
        this.offerService.update(offer).subscribe(response => {
            this.eventManager.broadcast({
                name: 'offerListModification',
                content: 'Deleted an offer'
            });
            this.swalWithBootstrapButtons.fire('Deshabilitada!', 'La oferta ha sido deshabilitada.', 'success');
        });
    }

    enableItem(offer: IOffer) {
        this.swalWithBootstrapButtons
            .fire({
                title: 'Está seguro que desea habilitar la oferta?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, habilitar!',
                cancelButtonText: 'No, cancelar!',
                reverseButtons: true
            })
            .then(result => {
                if (result.value) {
                    this.confirmEnable(offer);
                }
            });
    }
    confirmEnable(offer: IOffer) {
        offer.disabled = false;
        this.offerService.update(offer).subscribe(response => {
            this.eventManager.broadcast({
                name: 'offerListModification',
                content: 'Deleted an offer'
            });
            this.swalWithBootstrapButtons.fire('Habilitada!', 'La oferta ha sido habilitada.', 'success');
        });
    }
}
