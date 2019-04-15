import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IMarkerplace, Markerplace } from 'app/shared/model/markerplace.model';
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
    radio = 3;
    marks: google.maps.Marker[] = [];
    infoWindows: google.maps.InfoWindow[] = [];
    markUser: Markerplace;
    convertionFactorkm = 0.009072;

    markerPlaces: Markerplace[] = [];

    constructor(private http: HttpClient, private commerceService: CommerceService, protected jhiAlertService: JhiAlertService) {}

    ngOnInit() {
        this.loadMap();
        this.geoLocation();
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    isInArea(center: Markerplace, radio: number, point: Markerplace) {
        const distance = Math.sqrt(Math.pow(point.lng - center.lng, 2) + Math.pow(point.lat - center.lat, 2));

        if (distance <= radio) {
            return true;
        } else {
            return false;
        }
    }

    loadMap() {
        const latLng = new google.maps.LatLng(9.9333296, -84.0833282);

        const mapOptions: google.maps.MapOptions = {
            center: latLng,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }

    loadMarks() {
        for (let item of this.marks) {
            item.setMap(null);
        }
        this.marks.length = 0;

        this.addMarkUser(this.markUser);

        this.commerceService
            .queryByState(false)
            .pipe(
                filter((res: HttpResponse<ICommerce[]>) => res.ok),
                map((res: HttpResponse<ICommerce[]>) => res.body)
            )
            .subscribe(
                (res: ICommerce[]) => {
                    this.commerces = res;
                    if (this.commerces.length !== 0) {
                        for (const item of this.commerces) {
                            const markCommerce: Markerplace = {
                                name: item.name,
                                lat: item.latitude,
                                lng: item.longitud,
                                id: item.id.toString()
                            };

                            let validation = this.isInArea(this.markUser, this.radio * this.convertionFactorkm, markCommerce);

                            if (validation) {
                                this.addMark(markCommerce);
                            }
                        }
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
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

    addMarkUser(markUser: Markerplace) {
        const latLng = new google.maps.LatLng(markUser.lat, markUser.lng);

        const marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            draggable: true,
            title: markUser.id,
            icon: '../content/images/markUser.png'
        });
        this.marks.push(marker);

        const contentPlace = `<b>${markUser.name}</b>`;
        const infoWindow = new google.maps.InfoWindow({
            content: contentPlace
        });

        this.infoWindows.push(infoWindow);
        this.map.setCenter(marker.getPosition());

        google.maps.event.addDomListener(marker, 'click', () => {
            this.infoWindows.forEach(infoW => infoW.close());
            infoWindow.open(this.map, marker);
        });

        google.maps.event.addDomListener(marker, 'dblclick', coors => {
            marker.setMap(null);
        });
        google.maps.event.addDomListener(marker, 'drag', coors => {
            this.markUser.lat = coors.latLng.lat();
            this.markUser.lng = coors.latLng.lng();
            this.map.setCenter(marker.getPosition());
        });
    }

    geoLocation() {
        const infoWindow = new google.maps.InfoWindow();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    const markUser: Markerplace = {
                        name: 'Mi ubicación',
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        id: 'Mi ubicación'
                    };

                    this.markUser = markUser;
                    this.addMarkUser(markUser);
                },
                function() {
                    this.handleLocationError(true, infoWindow, this.map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            this.handleLocationError(false, infoWindow, this.map.getCenter());
        }
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
            browserHasGeolocation ? 'Error: Fallo el servicio de Geolocalozación' : 'Error: Su buscador no soporta la Geolocalizacón.'
        );
        infoWindow.open(map);
    }
}
