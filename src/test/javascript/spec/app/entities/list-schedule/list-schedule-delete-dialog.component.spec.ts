/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { ListScheduleDeleteDialogComponent } from 'app/entities/list-schedule/list-schedule-delete-dialog.component';
import { ListScheduleService } from 'app/entities/list-schedule/list-schedule.service';

describe('Component Tests', () => {
    describe('ListSchedule Management Delete Component', () => {
        let comp: ListScheduleDeleteDialogComponent;
        let fixture: ComponentFixture<ListScheduleDeleteDialogComponent>;
        let service: ListScheduleService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ListScheduleDeleteDialogComponent]
            })
                .overrideTemplate(ListScheduleDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ListScheduleDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ListScheduleService);
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
