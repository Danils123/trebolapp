import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUserExtra } from 'app/shared/model/user-extra.model';
import { AccountService, IUser } from 'app/core';
import { NavbarService } from 'app/layouts/navbar/navbar.service';
import { SidebarService } from 'app/layouts/sidebar/sidebar.service';

type EntityResponseType = HttpResponse<IUserExtra>;
type EntityArrayResponseType = HttpResponse<IUserExtra[]>;

@Injectable({ providedIn: 'root' })
export class UserExtraService {
    public resourceUrl = SERVER_API_URL + 'api/user-extras';
    public userExtra: IUserExtra;
    public user: IUser;

    constructor(protected http: HttpClient, private accountService: AccountService) {
        this.getUserExtraAndUser();
    }

    create(userExtra: IUserExtra): Observable<EntityResponseType> {
        return this.http.post<IUserExtra>(this.resourceUrl, userExtra, { observe: 'response' });
    }

    update(userExtra: IUserExtra): Observable<EntityResponseType> {
        return this.http.put<IUserExtra>(this.resourceUrl, userExtra, { observe: 'response' });
    }

    updateWithoutId(userExtra: IUserExtra): Observable<EntityResponseType> {
        return this.http.put<IUserExtra>(`${this.resourceUrl}-WithoutId`, userExtra, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IUserExtra>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    findByUserId(userId: number): Observable<EntityResponseType> {
        return this.http.get<IUserExtra>(`${this.resourceUrl}-byUserId/${userId}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IUserExtra[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
    getUserExtraAndUser() {
        this.accountService.identity().then(data => {
            this.user = data;
            this.findByUserId(data.id).subscribe(user => {
                this.userExtra = user.body;
            });
        });
    }

    refreshUser() {
        this.getUserExtraAndUser();
    }
}
