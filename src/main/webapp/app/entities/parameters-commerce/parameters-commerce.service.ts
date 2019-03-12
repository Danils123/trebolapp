import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IParametersCommerce } from 'app/shared/model/parameters-commerce.model';

type EntityResponseType = HttpResponse<IParametersCommerce>;
type EntityArrayResponseType = HttpResponse<IParametersCommerce[]>;

@Injectable({ providedIn: 'root' })
export class ParametersCommerceService {
    public resourceUrl = SERVER_API_URL + 'api/parameters-commerces';

    constructor(protected http: HttpClient) {}

    create(parametersCommerce: IParametersCommerce): Observable<EntityResponseType> {
        return this.http.post<IParametersCommerce>(this.resourceUrl, parametersCommerce, { observe: 'response' });
    }

    update(parametersCommerce: IParametersCommerce): Observable<EntityResponseType> {
        return this.http.put<IParametersCommerce>(this.resourceUrl, parametersCommerce, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IParametersCommerce>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IParametersCommerce[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
