import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICommerceUser } from 'app/shared/model/commerce-user.model';
import { ICommerce } from 'app/shared/model/commerce.model';
import { IUserExtra } from 'app/shared/model/user-extra.model';

type EntityResponseType = HttpResponse<ICommerceUser>;
type EntityArrayResponseType = HttpResponse<ICommerceUser[]>;

@Injectable({ providedIn: 'root' })
export class CommerceUserService {
    public resourceUrl = SERVER_API_URL + 'api/commerce-users';

    constructor(protected http: HttpClient) {}

    create(commerceUser: ICommerceUser): Observable<EntityResponseType> {
        return this.http.post<ICommerceUser>(this.resourceUrl, commerceUser, { observe: 'response' });
    }

    update(commerceUser: ICommerceUser): Observable<EntityResponseType> {
        return this.http.put<ICommerceUser>(this.resourceUrl, commerceUser, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ICommerceUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ICommerceUser[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findCommercesByUser(id: number): Observable<EntityArrayResponseType> {
        const url = SERVER_API_URL + '/api/commerce-commercesByUser';
        return this.http.get<ICommerce[]>(`${url}/${id}`, { observe: 'response' });
    }

    findUsersByCommerce(id: number): Observable<EntityArrayResponseType> {
        const url = SERVER_API_URL + '/api/commerce-usersByCommerce';
        return this.http.get<IUserExtra[]>(`${url}/${id}`, { observe: 'response' });
    }
}
