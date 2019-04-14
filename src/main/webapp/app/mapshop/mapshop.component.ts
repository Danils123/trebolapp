import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Markerplace } from 'app/shared/model/markerplace.model';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'jhi-mapshop',
    templateUrl: './mapshop.component.html',
    styleUrls: ['./mapshop.scss']
})
export class MapshopComponent implements OnInit {
    @ViewChild('map') mapElement: ElementRef;
    map: google.maps.Map;

    marks: google.maps.Marker[] = [];
    infoWindows: google.maps.InfoWindow[] = [];

    markerPlaces: Markerplace[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.loadMap();
    }

    loadMap() {
        const latLng = new google.maps.LatLng(9.9333296, -84.0833282);

        const mapOptions: google.maps.MapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }
}
