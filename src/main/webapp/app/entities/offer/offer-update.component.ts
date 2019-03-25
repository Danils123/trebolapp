import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from './offer.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'jhi-offer-update',
    templateUrl: './offer-update.component.html'
})
export class OfferUpdateComponent implements OnInit {
    offer: IOffer;
    isSaving: boolean;

    constructor(protected offerService: OfferService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ offer }) => {
            this.offer = offer;
            this.offer.type = 1;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.offer.id !== undefined) {
            this.subscribeToSaveResponse(this.offerService.update(this.offer));
        } else {
            this.subscribeToSaveResponse(this.offerService.create(this.offer));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IOffer>>) {
        result.subscribe((res: HttpResponse<IOffer>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            type: 'success',
            title: 'Categoria agregada satisfactoriamente'
        });
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
