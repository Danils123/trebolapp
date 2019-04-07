/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { CommerceUserDeleteDialogComponent } from 'app/entities/commerce-user/commerce-user-delete-dialog.component';
import { CommerceUserService } from 'app/entities/commerce-user/commerce-user.service';

describe('Component Tests', () => {
    describe('CommerceUser Management Delete Component', () => {
        let comp: CommerceUserDeleteDialogComponent;
        let fixture: ComponentFixture<CommerceUserDeleteDialogComponent>;
        let service: CommerceUserService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [CommerceUserDeleteDialogComponent]
            })
                .overrideTemplate(CommerceUserDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CommerceUserDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CommerceUserService);
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
