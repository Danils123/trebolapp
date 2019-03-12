import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISubCategory } from 'app/shared/model/sub-category.model';

type EntityResponseType = HttpResponse<ISubCategory>;
type EntityArrayResponseType = HttpResponse<ISubCategory[]>;

@Injectable({ providedIn: 'root' })
export class SubCategoryService {
    public resourceUrl = SERVER_API_URL + 'api/sub-categories';

    constructor(protected http: HttpClient) {}

    create(subCategory: ISubCategory): Observable<EntityResponseType> {
        return this.http.post<ISubCategory>(this.resourceUrl, subCategory, { observe: 'response' });
    }

    update(subCategory: ISubCategory): Observable<EntityResponseType> {
        return this.http.put<ISubCategory>(this.resourceUrl, subCategory, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ISubCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISubCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
