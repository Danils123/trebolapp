import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAuthority } from 'app/shared/model/authority.model';

type EntityResponseType = HttpResponse<IAuthority>;
type EntityArrayResponseType = HttpResponse<IAuthority[]>;

@Injectable({ providedIn: 'root' })
export class AuthorityService {
    public resourceUrl = SERVER_API_URL + 'api/authorities';

    constructor(protected http: HttpClient) {}

    create(authority: IAuthority): Observable<EntityResponseType> {
        return this.http.post<IAuthority>(this.resourceUrl, authority, { observe: 'response' });
    }

    update(authority: IAuthority): Observable<EntityResponseType> {
        return this.http.put<IAuthority>(this.resourceUrl, authority, { observe: 'response' });
    }

    find(name: string): Observable<EntityResponseType> {
        return this.http.get<IAuthority>(`${this.resourceUrl}/${name}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IAuthority[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(name: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${name}`, { observe: 'response' });
    }
}
