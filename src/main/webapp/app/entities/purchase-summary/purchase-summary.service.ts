import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPurchaseSummary } from 'app/shared/model/purchase-summary.model';

type EntityResponseType = HttpResponse<IPurchaseSummary>;
type EntityArrayResponseType = HttpResponse<IPurchaseSummary[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseSummaryService {
    public resourceUrl = SERVER_API_URL + 'api/purchase-summaries';
    isHomeDelivery = false;
    @Output() isHomeDeliveryEmitter: EventEmitter<boolean> = new EventEmitter();

    constructor(protected http: HttpClient) {}

    initHomeDelivery(state: boolean) {
        this.isHomeDelivery = state;
        this.isHomeDeliveryEmitter.emit(this.isHomeDelivery);
    }

    create(purchaseSummary: IPurchaseSummary): Observable<EntityResponseType> {
        return this.http.post<IPurchaseSummary>(this.resourceUrl, purchaseSummary, { observe: 'response' });
    }

    update(purchaseSummary: IPurchaseSummary): Observable<EntityResponseType> {
        return this.http.put<IPurchaseSummary>(this.resourceUrl, purchaseSummary, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPurchaseSummary>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPurchaseSummary[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
