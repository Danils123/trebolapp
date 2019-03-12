import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IScheduleCommerce } from 'app/shared/model/schedule-commerce.model';

type EntityResponseType = HttpResponse<IScheduleCommerce>;
type EntityArrayResponseType = HttpResponse<IScheduleCommerce[]>;

@Injectable({ providedIn: 'root' })
export class ScheduleCommerceService {
    public resourceUrl = SERVER_API_URL + 'api/schedule-commerces';

    constructor(protected http: HttpClient) {}

    create(scheduleCommerce: IScheduleCommerce): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(scheduleCommerce);
        return this.http
            .post<IScheduleCommerce>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(scheduleCommerce: IScheduleCommerce): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(scheduleCommerce);
        return this.http
            .put<IScheduleCommerce>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IScheduleCommerce>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IScheduleCommerce[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(scheduleCommerce: IScheduleCommerce): IScheduleCommerce {
        const copy: IScheduleCommerce = Object.assign({}, scheduleCommerce, {
            openTime: scheduleCommerce.openTime != null && scheduleCommerce.openTime.isValid() ? scheduleCommerce.openTime.toJSON() : null,
            closingtime:
                scheduleCommerce.closingtime != null && scheduleCommerce.closingtime.isValid()
                    ? scheduleCommerce.closingtime.toJSON()
                    : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.openTime = res.body.openTime != null ? moment(res.body.openTime) : null;
            res.body.closingtime = res.body.closingtime != null ? moment(res.body.closingtime) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((scheduleCommerce: IScheduleCommerce) => {
                scheduleCommerce.openTime = scheduleCommerce.openTime != null ? moment(scheduleCommerce.openTime) : null;
                scheduleCommerce.closingtime = scheduleCommerce.closingtime != null ? moment(scheduleCommerce.closingtime) : null;
            });
        }
        return res;
    }
}
