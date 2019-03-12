/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { CommerceDeleteDialogComponent } from 'app/entities/commerce/commerce-delete-dialog.component';
import { CommerceService } from 'app/entities/commerce/commerce.service';

describe('Component Tests', () => {
    describe('Commerce Management Delete Component', () => {
        let comp: CommerceDeleteDialogComponent;
        let fixture: ComponentFixture<CommerceDeleteDialogComponent>;
        let service: CommerceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [CommerceDeleteDialogComponent]
            })
                .overrideTemplate(CommerceDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CommerceDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CommerceService);
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
