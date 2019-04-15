import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOffer } from 'app/shared/model/offer.model';
import { AccountService } from 'app/core';
import { OfferService } from './offer.service';
import Swal from 'sweetalert2';
import { ICommerce } from '../../shared/model/commerce.model';
import { CommerceService } from '../commerce/commerce.service';
import { commercePopupRoute } from '../commerce/commerce.route';
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
        protected accountService: AccountService,
        protected commerceService: CommerceService
    ) {}

    loadAll() {
        let commerces: ICommerce[];
        let offers: IOffer[];
        this.filteredOffers = [];
        this.offers = [];
        commerces = this.accountService.userExtra.commerces;
        commerces.forEach(commerce => {
            this.offerService.findByCommerce(commerce.id).subscribe((res: HttpResponse<IOffer[]>) => {
                offers = res.body;
                offers.forEach(offer => {
                    this.filteredOffers.push(offer);
                    this.offers.push(offer);
                });
            });
        });
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
        offer.commerces = [];
        offer.commerces.push(this.accountService.userExtra.commerces[0]);
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
        offer.commerces = [];
        offer.commerces.push(this.accountService.userExtra.commerces[0]);
        this.offerService.update(offer).subscribe(response => {
            this.eventManager.broadcast({
                name: 'offerListModification',
                content: 'Deleted an offer'
            });
            this.swalWithBootstrapButtons.fire('Habilitada!', 'La oferta ha sido habilitada.', 'success');
        });
    }
}
