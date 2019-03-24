import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private _loading = false;
    loadingStatus = new Subject();
    get loading(): boolean {
        return this._loading;
    }

    set loading(value) {
        this._loading = value;
    }

    startLoading() {
        this.loading = true;
    }

    stopLoading() {
        this.loading = false;
    }
}
