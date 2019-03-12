import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IRankingPerOrder } from 'app/shared/model/ranking-per-order.model';

type EntityResponseType = HttpResponse<IRankingPerOrder>;
type EntityArrayResponseType = HttpResponse<IRankingPerOrder[]>;

@Injectable({ providedIn: 'root' })
export class RankingPerOrderService {
    public resourceUrl = SERVER_API_URL + 'api/ranking-per-orders';

    constructor(protected http: HttpClient) {}

    create(rankingPerOrder: IRankingPerOrder): Observable<EntityResponseType> {
        return this.http.post<IRankingPerOrder>(this.resourceUrl, rankingPerOrder, { observe: 'response' });
    }

    update(rankingPerOrder: IRankingPerOrder): Observable<EntityResponseType> {
        return this.http.put<IRankingPerOrder>(this.resourceUrl, rankingPerOrder, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IRankingPerOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IRankingPerOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
