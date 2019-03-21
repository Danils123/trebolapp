import { Component } from '@angular/core';
import { FooterService } from './footer.service';

@Component({
    selector: 'jhi-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent {
    constructor(public fs: FooterService) {}
}
