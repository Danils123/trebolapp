import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICommerceUser } from 'app/shared/model/commerce-user.model';

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
}
