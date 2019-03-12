/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { PointsCommerceDeleteDialogComponent } from 'app/entities/points-commerce/points-commerce-delete-dialog.component';
import { PointsCommerceService } from 'app/entities/points-commerce/points-commerce.service';

describe('Component Tests', () => {
    describe('PointsCommerce Management Delete Component', () => {
        let comp: PointsCommerceDeleteDialogComponent;
        let fixture: ComponentFixture<PointsCommerceDeleteDialogComponent>;
        let service: PointsCommerceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [PointsCommerceDeleteDialogComponent]
            })
                .overrideTemplate(PointsCommerceDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PointsCommerceDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PointsCommerceService);
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
