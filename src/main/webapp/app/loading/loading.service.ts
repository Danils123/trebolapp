import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { setTimeout } from 'timers';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    public _loading = true;
    public animated = false;
    loadingStatus = new Subject();
    get loading(): boolean {
        return this._loading;
    }

    set loading(value) {
        this._loading = value;
    }

    startLoading() {
        this.animated = false;
        this.loading = true;
    }

    stopLoading() {
        setTimeout(() => {
            this.animated = true;
            setTimeout(() => {
                this.loading = false;
            }, 2000);
        }, 1000);
    }
}
