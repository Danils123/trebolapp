import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICommerceUser } from 'app/shared/model/commerce-user.model';

@Component({
    selector: 'jhi-commerce-user-detail',
    templateUrl: './commerce-user-detail.component.html'
})
export class CommerceUserDetailComponent implements OnInit {
    commerceUser: ICommerceUser;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ commerceUser }) => {
            this.commerceUser = commerceUser;
        });
    }

    previousState() {
        window.history.back();
    }
}
