import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IDeliveryMap } from 'app/shared/model/delivery-map.model';
import { AccountService } from 'app/core';
import { DeliveryMapService } from './delivery-map.service';
import Swal from 'sweetalert2';
import { WebsocketNodeJSService } from '../../core/services/websocket-node-js.service';
@Component({
    selector: 'jhi-delivery-map',
    templateUrl: './delivery-map.component.html',
    styleUrls: ['./delivery-map.scss']
})
export class DeliveryMapComponent implements OnInit {
    deliveryMaps: IDeliveryMap[];
    currentAccount: any;
    eventSubscriber: Subscription;

    directionsDisplay: google.maps.DirectionsRenderer;
    directionsServices: google.maps.DirectionsService;

    @ViewChild('map') mapElement: ElementRef;
    map: google.maps.Map;

    originLatLng: google.maps.LatLng;
    destinationLatLng: google.maps.LatLng;
    origin: string;
    destination: string;
    timeRemaining: any;
    timeDuration: number;
    int: any;
    line: any;

    marcadores: google.maps.Marker[] = [];
    infoWindows: google.maps.InfoWindow[] = [];
    directionResult: google.maps.DirectionsResult;
    constructor(
        protected deliveryMapService: DeliveryMapService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected accountService: AccountService,
        private wsService: WebsocketNodeJSService
    ) {
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsServices = new google.maps.DirectionsService();
        this.origin = null;
        this.destination = null;
        this.timeRemaining = null;
    }

    ngOnInit() {
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.loadMap();
        this.deliveryMapService.changeCoordinates.subscribe((coordinates: google.maps.LatLng[]) => {
            this.originLatLng = coordinates[0];
            this.destinationLatLng = coordinates[1];
            this.drawRoad();
        });
        this.deliveryMapService.initDeliveryEmitter.subscribe(init => {
            this.createPolyline();
        });
    }
    loadMap() {
        const mapaOpciones: google.maps.MapOptions = {
            center: this.destinationLatLng === undefined ? new google.maps.LatLng(9.9323215, -84.0332226) : this.destinationLatLng,
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapaOpciones);
        this.map.setZoom(15);
        this.directionsDisplay.setMap(this.map);
    }
    drawRoad() {
        this.directionsServices.route(
            {
                origin: this.originLatLng,
                destination: this.destinationLatLng,
                travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.origin = result.routes[0].legs[0].start_address;
                    this.destination = result.routes[0].legs[0].end_address;
                    this.timeDuration = result.routes[0].legs[0].duration.value;

                    this.map.setZoom(7);
                    this.directionsDisplay.setDirections(result);
                    this.directionResult = result;
                } else {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'center',
                        showConfirmButton: false,
                        timer: 5000
                    });
                    Toast.fire({
                        type: 'error',
                        title: 'Ha ocurrido un incoveniente en el proceso de entrega, favor contacte a soporte'
                    });
                    console.log('Directions request failed due to ' + status);
                }
            }
        );
    }

    createPolyline() {
        if (this.line !== undefined) {
            this.line.setMap(null);
            clearInterval(this.int);
        }
        this.line = new google.maps.Polyline({
            path: [],
            strokeColor: '#FF0000',
            strokeOpacity: 0.5,
            strokeWeight: 4,
            icons: [
                {
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        strokeColor: '#393'
                    },
                    offset: '0%'
                }
            ]
        });
        const legs = this.directionResult.routes[0].legs;
        for (const leg of legs) {
            for (const step of leg.steps) {
                for (const nextSegment of step.path) {
                    this.line.getPath().push(nextSegment);
                }
            }
        }
        this.line.setMap(this.map);
        this.listenSocket();
    }

    updateMarker(percentage, line) {
        let icons = line.icons;
        icons = line.icons;
        icons[0].offset = percentage;
        line.set('icons', icons);
        this.timeRemaining = this.timeDuration - this.timeDuration * (percentage.split('%')[0] / 100);
        this.timeRemaining = this.timeRemaining.toFixed(2);
        if (percentage === '99.5%') {
            this.deliveryMapService.changeState();
        }
    }

    listenSocket() {
        this.wsService.emit('position-courier');
        this.wsService.listen('actual-position').subscribe(percentage => {
            this.updateMarker(percentage, this.line);
        });
    }
}
