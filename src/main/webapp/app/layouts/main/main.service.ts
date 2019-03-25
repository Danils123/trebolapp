import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MainService {
    visible = false;
    constructor() {}
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
}
