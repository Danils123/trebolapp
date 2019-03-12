/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { ScheduleCommerceDeleteDialogComponent } from 'app/entities/schedule-commerce/schedule-commerce-delete-dialog.component';
import { ScheduleCommerceService } from 'app/entities/schedule-commerce/schedule-commerce.service';

describe('Component Tests', () => {
    describe('ScheduleCommerce Management Delete Component', () => {
        let comp: ScheduleCommerceDeleteDialogComponent;
        let fixture: ComponentFixture<ScheduleCommerceDeleteDialogComponent>;
        let service: ScheduleCommerceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ScheduleCommerceDeleteDialogComponent]
            })
                .overrideTemplate(ScheduleCommerceDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ScheduleCommerceDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ScheduleCommerceService);
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
