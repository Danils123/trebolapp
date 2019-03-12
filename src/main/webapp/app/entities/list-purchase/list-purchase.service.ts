import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IListPurchase } from 'app/shared/model/list-purchase.model';

type EntityResponseType = HttpResponse<IListPurchase>;
type EntityArrayResponseType = HttpResponse<IListPurchase[]>;

@Injectable({ providedIn: 'root' })
export class ListPurchaseService {
    public resourceUrl = SERVER_API_URL + 'api/list-purchases';

    constructor(protected http: HttpClient) {}

    create(listPurchase: IListPurchase): Observable<EntityResponseType> {
        return this.http.post<IListPurchase>(this.resourceUrl, listPurchase, { observe: 'response' });
    }

    update(listPurchase: IListPurchase): Observable<EntityResponseType> {
        return this.http.put<IListPurchase>(this.resourceUrl, listPurchase, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IListPurchase>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IListPurchase[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
