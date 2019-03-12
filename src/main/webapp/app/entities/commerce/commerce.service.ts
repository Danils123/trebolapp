import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICommerce } from 'app/shared/model/commerce.model';

type EntityResponseType = HttpResponse<ICommerce>;
type EntityArrayResponseType = HttpResponse<ICommerce[]>;

@Injectable({ providedIn: 'root' })
export class CommerceService {
    public resourceUrl = SERVER_API_URL + 'api/commerce';

    constructor(protected http: HttpClient) {}

    create(commerce: ICommerce): Observable<EntityResponseType> {
        return this.http.post<ICommerce>(this.resourceUrl, commerce, { observe: 'response' });
    }

    update(commerce: ICommerce): Observable<EntityResponseType> {
        return this.http.put<ICommerce>(this.resourceUrl, commerce, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICommerce>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICommerce[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
