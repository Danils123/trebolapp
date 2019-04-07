import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModalService } from 'app/core';
import { ActivateService } from './activate.service';
import { MainService } from 'app/layouts/main/main.service';
import Swal from 'sweetalert2';
@Component({
    selector: 'jhi-activate',
    templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit, OnDestroy {
    error: string;
    success: string;
    modalRef: NgbModalRef;

    constructor(
        private activateService: ActivateService,
        private route: ActivatedRoute,
        private mainService: MainService,
        private router: Router
    ) {}

    ngOnInit() {
        this.mainService.show();
        this.route.queryParams.subscribe(params => {
            this.activateService.get(params['key']).subscribe(
                () => {
                    this.error = null;
                    this.success = 'OK';
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 7000
                    });
                    Toast.fire({
                        type: 'success',
                        title: 'Bienvenido(a) a Trebol'
                    });
                    setTimeout(() => {
                        this.router.navigate(['/']);
                    }, 7000);
                },
                () => {
                    this.success = null;
                    this.error = 'ERROR';
                }
            );
        });
    }

    ngOnDestroy() {
        this.mainService.hide();
    }
}
