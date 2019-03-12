import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IProductsPerOrder } from 'app/shared/model/products-per-order.model';

type EntityResponseType = HttpResponse<IProductsPerOrder>;
type EntityArrayResponseType = HttpResponse<IProductsPerOrder[]>;

@Injectable({ providedIn: 'root' })
export class ProductsPerOrderService {
    public resourceUrl = SERVER_API_URL + 'api/products-per-orders';

    constructor(protected http: HttpClient) {}

    create(productsPerOrder: IProductsPerOrder): Observable<EntityResponseType> {
        return this.http.post<IProductsPerOrder>(this.resourceUrl, productsPerOrder, { observe: 'response' });
    }

    update(productsPerOrder: IProductsPerOrder): Observable<EntityResponseType> {
        return this.http.put<IProductsPerOrder>(this.resourceUrl, productsPerOrder, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IProductsPerOrder>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IProductsPerOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
