import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LandingService {
    visible = true;
    constructor() {}
    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }
}
