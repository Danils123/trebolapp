import { Injectable } from '@angular/core';
import { UserExtraService } from 'app/entities/user-extra';

@Injectable({
    providedIn: 'root'
})
export class NavbarService {
    visible: boolean;

    constructor() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    toggle() {
        this.visible = !this.visible;
    }

    doSomethingElseUseful() {}
}
