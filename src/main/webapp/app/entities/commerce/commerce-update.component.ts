import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from './commerce.service';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from 'app/entities/product-commerce';
import { IOffer } from 'app/shared/model/offer.model';
import { OfferService } from 'app/entities/offer/offer.service';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { UserExtraService } from 'app/entities/user-extra';
import { AccountService } from 'app/core';
import Swal from 'sweetalert2';
import { Markerplace } from 'app/shared/model/markerplace.model';
import { TextMaskModule } from 'angular2-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';
import { NgForm } from '@angular/forms';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
@Component({
    selector: 'jhi-commerce-update',
    templateUrl: './commerce-update.component.html',
    styleUrls: ['./commerce.scss']
})
export class CommerceUpdateComponent implements OnInit {
    @ViewChild('map') mapElement: ElementRef;
    map: google.maps.Map;
    marks: google.maps.Marker[] = [];
    infoWindows: google.maps.InfoWindow[] = [];

    markerPlaces: Markerplace[] = [];

    commerce: ICommerce;
    isSaving: boolean;
    owner: IUserExtra;

    productcommerces: IProductCommerce[];

    offers: IOffer[];

    userextras: IUserExtra[];
    chkState: boolean;

    public IDMask: Array<string | RegExp>;
    public phoneMask: Array<string | RegExp>;
    public emailMask = emailMask;

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected commerceService: CommerceService,
        protected productCommerceService: ProductCommerceService,
        protected offerService: OfferService,
        protected userExtraService: UserExtraService,
        protected activatedRoute: ActivatedRoute,
        public textMask: TextMaskModule,
        private accountService: AccountService
    ) {
        this.IDMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
        this.phoneMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ commerce }) => {
            this.commerce = commerce;
            this.commerce.email = this.accountService.user.email;

            if (this.commerce.state !== null) {
                this.chkState = this.commerce.state;
            } else {
                this.chkState = false;
            }

            this.loadMap();
        });
        this.productCommerceService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProductCommerce[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProductCommerce[]>) => response.body)
            )
            .subscribe((res: IProductCommerce[]) => (this.productcommerces = res), (res: HttpErrorResponse) => this.onError(res.message));

        this.userExtraService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IUserExtra[]>) => mayBeOk.ok),
                map((response: HttpResponse<IUserExtra[]>) => response.body)
            )
            .subscribe((res: IUserExtra[]) => (this.userextras = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.owner = this.accountService.userExtra;
        this.accountService.getUserExtraAndUser();
    }

    previousState() {
        window.history.back();
    }

    isVendedor() {
        return this.accountService.identity().then(account => this.accountService.hasAnyAuthority(['ROLE_VENDEDOR']));
    }

    save() {
        this.isSaving = true;
        this.commerce.owner = this.owner;
        this.commerce.userExtra = this.owner;
        if (this.commerce.id !== undefined) {
            this.commerce.state = this.chkState;
            this.subscribeToSaveResponse(this.commerceService.update(this.commerce));
        } else {
            this.commerce.state = false;
            this.subscribeToSaveResponse(this.commerceService.create(this.commerce));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommerce>>) {
        result.subscribe((res: HttpResponse<ICommerce>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
            title: 'Comercio guardado satisfactoriamente'
        });
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackProductCommerceById(index: number, item: IProductCommerce) {
        return item.id;
    }

    trackOfferById(index: number, item: IOffer) {
        return item.id;
    }

    trackUserExtraById(index: number, item: IUserExtra) {
        return item.id;
    }

    loadMap() {
        let latLng = new google.maps.LatLng(9.9333296, -84.0833282);

        if (this.commerce.latitude !== null) {
            latLng = new google.maps.LatLng(this.commerce.latitude, this.commerce.longitud);
        }

        const mapOptions: google.maps.MapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        if (this.commerce.longitud === null) {
            this.map.addListener('click', coors => {
                const markCommerce: Markerplace = {
                    name: this.commerce.name,
                    lat: coors.latLng.lat(),
                    lng: coors.latLng.lng(),
                    id: new Date().toISOString()
                };

                this.commerce.latitude = coors.latLng.lat();
                this.commerce.longitud = coors.latLng.lng();
                this.addMark(markCommerce);
            });
        } else {
            const markCommerce: Markerplace = {
                name: this.commerce.name,
                lat: this.commerce.latitude,
                lng: this.commerce.longitud,
                id: new Date().toISOString()
            };

            this.addMark(markCommerce);
        }
    }

    addMark(markCommerce: Markerplace) {
        const latLng = new google.maps.LatLng(markCommerce.lat, markCommerce.lng);

        const marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            draggable: true,
            title: markCommerce.id
        });

        const contentPlace = `<b>${markCommerce.name}</b>`;
        const infoWindow = new google.maps.InfoWindow({
            content: contentPlace
        });

        this.infoWindows.push(infoWindow);

        google.maps.event.addDomListener(marker, 'click', () => {
            this.infoWindows.forEach(infoW => infoW.close());
            infoWindow.open(this.map, marker);
        });

        google.maps.event.addDomListener(marker, 'dblclick', coors => {
            this.commerce.latitude = undefined;
            this.commerce.longitud = undefined;
            marker.setMap(null);
        });

        google.maps.event.addDomListener(marker, 'drag', coors => {
            const newMark = {
                lat: coors.latLng.lat(),
                lng: coors.latLng.lng(),
                name: markCommerce.name,
                id: markCommerce.id
            };

            this.commerce.latitude = coors.latLng.lat();
            this.commerce.longitud = coors.latLng.lng();
        });
    }

    changeState() {
        if (this.chkState === true) {
            this.chkState = false;
        } else {
            this.chkState = true;
        }
    }

    validateIdentification(form: NgForm) {
        const text = form.form.controls.identification.value;
        const underscore = '_';
        if (text.includes(underscore)) {
            form.form.controls.identification.setErrors({ incorrect: true });
        }
        console.log(this.commerce.identification);
        return form;
    }

    validatePhone(form: NgForm) {
        const text = form.form.controls.phone.value;
        const underscore = '_';
        if (text.includes(underscore)) {
            form.form.controls.phone.setErrors({ incorrect: true });
        }
        return form;
    }
}
