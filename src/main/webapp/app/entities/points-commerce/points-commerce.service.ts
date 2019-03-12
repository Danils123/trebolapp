import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPointsCommerce } from 'app/shared/model/points-commerce.model';

type EntityResponseType = HttpResponse<IPointsCommerce>;
type EntityArrayResponseType = HttpResponse<IPointsCommerce[]>;

@Injectable({ providedIn: 'root' })
export class PointsCommerceService {
    public resourceUrl = SERVER_API_URL + 'api/points-commerces';

    constructor(protected http: HttpClient) {}

    create(pointsCommerce: IPointsCommerce): Observable<EntityResponseType> {
        return this.http.post<IPointsCommerce>(this.resourceUrl, pointsCommerce, { observe: 'response' });
    }

    update(pointsCommerce: IPointsCommerce): Observable<EntityResponseType> {
        return this.http.put<IPointsCommerce>(this.resourceUrl, pointsCommerce, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPointsCommerce>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPointsCommerce[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
