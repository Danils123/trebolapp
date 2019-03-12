import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProductList } from 'app/shared/model/product-list.model';

type EntityResponseType = HttpResponse<IProductList>;
type EntityArrayResponseType = HttpResponse<IProductList[]>;

@Injectable({ providedIn: 'root' })
export class ProductListService {
    public resourceUrl = SERVER_API_URL + 'api/product-lists';

    constructor(protected http: HttpClient) {}

    create(productList: IProductList): Observable<EntityResponseType> {
        return this.http.post<IProductList>(this.resourceUrl, productList, { observe: 'response' });
    }

    update(productList: IProductList): Observable<EntityResponseType> {
        return this.http.put<IProductList>(this.resourceUrl, productList, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProductList>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductList[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
