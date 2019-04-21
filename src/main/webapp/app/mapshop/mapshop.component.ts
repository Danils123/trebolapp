import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Markerplace } from 'app/shared/model/markerplace.model';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { ICommerce } from 'app/shared/model/commerce.model';
import { CommerceService } from 'app/entities/commerce';
import { JhiAlertService } from 'ng-jhipster';
import { IScheduleCommerce } from 'app/shared/model/schedule-commerce.model';
import { ScheduleCommerceService } from 'app/entities/schedule-commerce';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';
import { ProductCommerceService } from 'app/entities/product-commerce';
import { ProductShop } from 'app/shared/model/ProductShop.model';
import { ProductListService } from 'app/entities/product-list';
import { IListPurchase } from 'app/shared/model/list-purchase.model';
import { IProductList } from 'app/shared/model/product-list.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { IProduct } from 'app/shared/model/product.model';
import { ProductService } from 'app/entities/product';
import { IListShop, ListShop } from 'app/shared/model/listShop.model';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { MapshopService } from './mapshop.service';
import Swal from 'sweetalert2';

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
    scheduleCommerce: IScheduleCommerce[][];
    productShop: ProductShop;
    commercesInArea: ICommerce[];
    productCommerceInArea: IProductCommerce[];
    costPurchase: number;
    listPurchase: IListPurchase;
    productListforShop: IProductList[];
    allProducts: IProduct[];
    listsShop: IListShop[];
    listShop: IListShop;
    visibleCard = false;
    scheduleEnable = false;
    flagCommerce: boolean;

    private swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success ml-3',
            cancelButton: 'btn btn-danger ml-3'
        },
        buttonsStyling: false
    });

    constructor(
        private http: HttpClient,
        private commerceService: CommerceService,
        protected jhiAlertService: JhiAlertService,
        private scheduleCommerceService: ScheduleCommerceService,
        private productCommerceService: ProductCommerceService,
        private productListService: ProductListService,
        private productService: ProductService,
        private _scrollToService: ScrollToService,
        private mapShopService: MapshopService,
        private elRef: ElementRef
    ) {
        this.mapShopService.idListEmitter.subscribe(id => {
            this.listPurchase = new class implements IListPurchase {
                description: string;
                id = id;
                name: string;
                productList: IProductList;
                seller: IUserExtra;
                state: boolean;
            }();
            this.productShop = new ProductShop();
            this.loadProductListPerBuy();
            this.loadAllProducts();
        });
    }

    ngOnInit() {
        this.flagCommerce = true;
        this.loadMap();
        this.geoLocation();
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    isInArea(center: Markerplace, radio: number, point: ICommerce) {
        const distance = Math.sqrt(Math.pow(point.longitud - center.lng, 2) + Math.pow(point.latitude - center.lat, 2));

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
        for (const item of this.marks) {
            item.setMap(null);
        }
        this.commercesInArea = [];
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
                            const validation = this.isInArea(this.markUser, this.radio * this.convertionFactorkm, item);

                            if (validation) {
                                console.log(item);
                                this.loadListShopCommerce(item);
                                this.commercesInArea.push(item);
                                this.loadScheduleCommerce(item);
                            }
                        }
                        this.map.setZoom(12);
                    }

                    if (this.commercesInArea.length === 0) {
                        this.messageNotCommerce();
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    addMark(markCommerce: ICommerce) {
        const latLng = new google.maps.LatLng(markCommerce.latitude, markCommerce.longitud);

        const marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: latLng,
            draggable: false,
            title: markCommerce.name
        });

        this.marks.push(marker);

        const contentPlace = `<b class="tex"><strong>${markCommerce.name}</strong></b> <hr/>
                              <b>${this.costPurchase} colones</b>
                              <br><b> es el costo total de la lista</b>
                              <hr/>
                              <a href="javascript:void(0)" (click)="sentData()">Seleccionar        </a>|
                              <a href="javascript:void(0)" (click)="dummie()">          Ver más</a>`;
        const infoWindow = new google.maps.InfoWindow({
            content: contentPlace
        });

        this.infoWindows.push(infoWindow);

        google.maps.event.addDomListener(marker, 'click', () => {
            this.infoWindows.forEach(infoW => infoW.close());
            infoWindow.open(this.map, marker);
        });

        google.maps.event.addDomListener(marker, 'dblclick', () => {
            this.doubleClickEvet(markCommerce);
        });
    }

    dummie() {
        console.log('EVENT');
    }

    doubleClickEvet(markCommerce: ICommerce) {
        this.flagCommerce = false;
        this.scheduleEnable = false;
        this.visibleCardDetail();
        this.productShop.commerce = markCommerce;
        this.productShop.user = this.markUser;
        this.loadListShopCommerce(markCommerce);
        this.loadScheduleCommerce(markCommerce);
        this.productShop.listShop = this.listsShop;
        this.goToDetail();
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
        this.map.setZoom(8);
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
            browserHasGeolocation ? 'Error: Fallo el servicio de Geolocalozación' : 'Error: Su buscador no soporta la Geolocalizacón.'
        );
        infoWindow.open(map);
    }

    loadListShopCommerce(commerce: ICommerce) {
        this.productCommerceService
            .queryByCommerceId(commerce.id)
            .pipe(
                filter((res: HttpResponse<IProductCommerce[]>) => res.ok),
                map((res: HttpResponse<IProductCommerce[]>) => res.body)
            )
            .subscribe(
                (res: IProductCommerce[]) => {
                    this.productCommerceInArea = res;
                    this.addPriceToList(this.productCommerceInArea, commerce);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadScheduleCommerce(commerce: ICommerce) {
        this.scheduleCommerce = [];
        this.scheduleCommerceService
            .findByCommerce(commerce.id)
            .pipe(
                filter((response: HttpResponse<IScheduleCommerce[]>) => response.ok),
                map((response: HttpResponse<IScheduleCommerce[]>) => response.body)
            )
            .subscribe(
                (response: IScheduleCommerce[]) => {
                    if (response.length > 0) {
                        this.scheduleEnable = true;
                    }
                    this.scheduleCommerce.push(response);
                },
                (response: HttpErrorResponse) => this.onError(response.message)
            );
    }

    loadProductListPerBuy() {
        this.productListService
            .queryList(this.listPurchase.id)
            .pipe(
                filter((res: HttpResponse<IProductList[]>) => res.ok),
                map((res: HttpResponse<IProductList[]>) => res.body)
            )
            .subscribe(
                (res: IProductList[]) => {
                    this.productListforShop = res;
                },
                (res1: HttpErrorResponse) => this.onError(res1.message)
            );
    }

    loadAllProducts() {
        this.productService
            .query()
            .pipe(
                filter((res: HttpResponse<IProduct[]>) => res.ok),
                map((res: HttpResponse<IProduct[]>) => res.body)
            )
            .subscribe(
                (res: IProduct[]) => {
                    this.allProducts = res;
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    addPriceToList(productCommerce: IProductCommerce[], commerce: ICommerce) {
        this.listsShop = [];
        this.costPurchase = 0;

        for (const item of this.productListforShop) {
            for (const product of this.allProducts) {
                this.listShop = new ListShop();
                if (item.name === product.name && item.brand === product.brand) {
                    this.listShop.product = product;
                    for (const productcommer of productCommerce) {
                        if (product.id === productcommer.product.id) {
                            this.listShop.price = productcommer.price;
                            this.listShop.inventoryQty = productcommer.quantity;
                            this.listShop.QtyBuy = item.quantity;
                            this.listsShop.push(this.listShop);
                            this.costPurchase = this.costPurchase + this.listShop.price * this.listShop.QtyBuy;
                        }
                    }
                }
            }
        }
        if (this.flagCommerce) {
            this.addMark(commerce);
        }
    }

    sentData() {
        this.mapShopService.sendInformation(this.productShop);
    }

    visibleCardDetail() {
        this.visibleCard = true;
    }

    disableCard() {
        this.visibleCard = false;
    }

    goToDetail() {
        const config: ScrollToConfigOptions = { target: 'bottom' };
        this._scrollToService.scrollTo(config);
    }

    messageNotCommerce() {
        this.swalWithBootstrapButtons.fire({
            title: 'No hay comercios cercanos',
            text: 'Puede aumentar el rango de búsqueda',
            type: 'warning',
            confirmButtonText: 'Cerrar ventana',
            reverseButtons: true
        });
    }
}
