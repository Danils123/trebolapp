import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPurchase } from 'app/shared/model/purchase.model';

type EntityResponseType = HttpResponse<IPurchase>;
type EntityArrayResponseType = HttpResponse<IPurchase[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseService {
    public resourceUrl = SERVER_API_URL + 'api/purchases';

    // Los estados de los diferentes componentes de la compra
    statePayment = false;
    stateMap = false;
    stateDelivery = false;
    stateSummary = false;

    // // Los eventEmmitter para cada estado
    // @Output() emitterStatePayment: EventEmitter<boolean> = new EventEmitter();
    // @Output() emitterStateMap: EventEmitter<boolean> = new EventEmitter();
    // @Output() emitterStateDelivery: EventEmitter<boolean> = new EventEmitter();
    // @Output() emitterStateSummary: EventEmitter<boolean> = new EventEmitter();

    LantLng: google.maps.LatLng[];
    @Output() process: EventEmitter<boolean> = new EventEmitter();
    @Output() changeCoordinates: EventEmitter<google.maps.LatLng[]> = new EventEmitter();

    constructor(protected http: HttpClient) {}

    create(purchase: IPurchase): Observable<EntityResponseType> {
        return this.http.post<IPurchase>(this.resourceUrl, purchase, { observe: 'response' });
    }

    update(purchase: IPurchase): Observable<EntityResponseType> {
        return this.http.put<IPurchase>(this.resourceUrl, purchase, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPurchase>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPurchase[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
