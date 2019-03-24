import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable({
    providedIn: 'root'
})
export class Register {
    visible = false;
    constructor(private http: HttpClient) {
        this.visible = false;
    }

    hide() {
        this.visible = false;
    }
    show() {
        this.visible = true;
        console.log(this.visible);
    }
    toggle() {
        this.visible = !this.visible;
    }
    save(account: any): Observable<any> {
        return this.http.post(SERVER_API_URL + 'api/register', account);
    }
}
