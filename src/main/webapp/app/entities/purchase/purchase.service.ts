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
