/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { ListPurchaseDeleteDialogComponent } from 'app/entities/list-purchase/list-purchase-delete-dialog.component';
import { ListPurchaseService } from 'app/entities/list-purchase/list-purchase.service';

describe('Component Tests', () => {
    describe('ListPurchase Management Delete Component', () => {
        let comp: ListPurchaseDeleteDialogComponent;
        let fixture: ComponentFixture<ListPurchaseDeleteDialogComponent>;
        let service: ListPurchaseService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ListPurchaseDeleteDialogComponent]
            })
                .overrideTemplate(ListPurchaseDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ListPurchaseDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ListPurchaseService);
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
