import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProductCommerce } from 'app/shared/model/product-commerce.model';

type EntityResponseType = HttpResponse<IProductCommerce>;
type EntityArrayResponseType = HttpResponse<IProductCommerce[]>;

@Injectable({ providedIn: 'root' })
export class ProductCommerceService {
    public resourceUrl = SERVER_API_URL + 'api/product-commerces';

    constructor(protected http: HttpClient) {}

    create(productCommerce: IProductCommerce): Observable<EntityResponseType> {
        return this.http.post<IProductCommerce>(this.resourceUrl, productCommerce, { observe: 'response' });
    }

    update(productCommerce: IProductCommerce): Observable<EntityResponseType> {
        return this.http.put<IProductCommerce>(this.resourceUrl, productCommerce, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProductCommerce>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductCommerce[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    queryByCommerceId(id: number): Observable<EntityArrayResponseType> {
        return this.http.get<IProductCommerce[]>(`${this.resourceUrl}-bycommerce/${id}`, { observe: 'response' });
    }
}
