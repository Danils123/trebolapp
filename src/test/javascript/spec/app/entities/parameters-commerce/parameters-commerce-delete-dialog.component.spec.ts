/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { ParametersCommerceDeleteDialogComponent } from 'app/entities/parameters-commerce/parameters-commerce-delete-dialog.component';
import { ParametersCommerceService } from 'app/entities/parameters-commerce/parameters-commerce.service';

describe('Component Tests', () => {
    describe('ParametersCommerce Management Delete Component', () => {
        let comp: ParametersCommerceDeleteDialogComponent;
        let fixture: ComponentFixture<ParametersCommerceDeleteDialogComponent>;
        let service: ParametersCommerceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ParametersCommerceDeleteDialogComponent]
            })
                .overrideTemplate(ParametersCommerceDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ParametersCommerceDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ParametersCommerceService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
