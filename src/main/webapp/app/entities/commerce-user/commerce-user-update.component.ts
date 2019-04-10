import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ICommerceUser } from 'app/shared/model/commerce-user.model';
import { CommerceUserService } from './commerce-user.service';

@Component({
    selector: 'jhi-commerce-user-update',
    templateUrl: './commerce-user-update.component.html'
})
export class CommerceUserUpdateComponent implements OnInit {
    commerceUser: ICommerceUser;
    isSaving: boolean;

    constructor(protected commerceUserService: CommerceUserService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ commerceUser }) => {
            this.commerceUser = commerceUser;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.commerceUser.id !== undefined) {
            this.subscribeToSaveResponse(this.commerceUserService.update(this.commerceUser));
        } else {
            this.subscribeToSaveResponse(this.commerceUserService.create(this.commerceUser));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICommerceUser>>) {
        result.subscribe((res: HttpResponse<ICommerceUser>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
