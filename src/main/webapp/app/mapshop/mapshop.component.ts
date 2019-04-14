import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Markerplace } from 'app/shared/model/markerplace.model';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from 'app/entities/commerce';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-mapshop',
    templateUrl: './mapshop.component.html',
    styleUrls: ['./mapshop.scss']
})
export class MapshopComponent implements OnInit {
    @ViewChild('map') mapElement: ElementRef;
    map: google.maps.Map;
    commerces: ICommerce[];

    marks: google.maps.Marker[] = [];
    infoWindows: google.maps.InfoWindow[] = [];

    markerPlaces: Markerplace[] = [];

    constructor(private http: HttpClient, private commerceService: CommerceService, protected jhiAlertService: JhiAlertService) {}

    ngOnInit() {
        this.commerceService
            .query()
            .pipe(
                filter((res: HttpResponse<ICommerce[]>) => res.ok),
                map((res: HttpResponse<ICommerce[]>) => res.body)
            )
            .subscribe(
                (res: ICommerce[]) => {
                    this.commerces = res;
                    this.loadMap();
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    loadMap() {
        const latLng = new google.maps.LatLng(9.9333296, -84.0833282);

        const mapOptions: google.maps.MapOptions = {
            center: latLng,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        if (this.commerces.length !== 0) {
            for (const item of this.commerces) {
                const markCommerce: Markerplace = {
                    name: item.name,
                    lat: item.latitude,
                    lng: item.longitud,
                    id: item.id.toString()
                };

                this.addMark(markCommerce);
            }
        }
    }

    addMark(markCommerce: Markerplace) {
        const latLng = new google.maps.LatLng(markCommerce.lat, markCommerce.lng);

        const marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            draggable: false,
            title: markCommerce.name
        });

        this.marks.push(marker);

        const contentPlace = `<b>${markCommerce.name}</b>`;
        const infoWindow = new google.maps.InfoWindow({
            content: contentPlace
        });

        this.infoWindows.push(infoWindow);

        google.maps.event.addDomListener(marker, 'click', () => {
            this.infoWindows.forEach(infoW => infoW.close());
            infoWindow.open(this.map, marker);
        });
    }
}
