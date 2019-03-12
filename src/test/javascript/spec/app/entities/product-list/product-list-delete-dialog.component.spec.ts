/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { ProductListDeleteDialogComponent } from 'app/entities/product-list/product-list-delete-dialog.component';
import { ProductListService } from 'app/entities/product-list/product-list.service';

describe('Component Tests', () => {
    describe('ProductList Management Delete Component', () => {
        let comp: ProductListDeleteDialogComponent;
        let fixture: ComponentFixture<ProductListDeleteDialogComponent>;
        let service: ProductListService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductListDeleteDialogComponent]
            })
                .overrideTemplate(ProductListDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductListDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductListService);
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
