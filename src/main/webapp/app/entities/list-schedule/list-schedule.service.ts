import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IListSchedule } from 'app/shared/model/list-schedule.model';

type EntityResponseType = HttpResponse<IListSchedule>;
type EntityArrayResponseType = HttpResponse<IListSchedule[]>;

@Injectable({ providedIn: 'root' })
export class ListScheduleService {
    public resourceUrl = SERVER_API_URL + 'api/list-schedules';

    constructor(protected http: HttpClient) {}

    create(listSchedule: IListSchedule): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(listSchedule);
        return this.http
            .post<IListSchedule>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(listSchedule: IListSchedule): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(listSchedule);
        return this.http
            .put<IListSchedule>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IListSchedule>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IListSchedule[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(listSchedule: IListSchedule): IListSchedule {
        const copy: IListSchedule = Object.assign({}, listSchedule, {
            time: listSchedule.time != null && listSchedule.time.isValid() ? listSchedule.time.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.time = res.body.time != null ? moment(res.body.time) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((listSchedule: IListSchedule) => {
                listSchedule.time = listSchedule.time != null ? moment(listSchedule.time) : null;
            });
        }
        return res;
    }
}
