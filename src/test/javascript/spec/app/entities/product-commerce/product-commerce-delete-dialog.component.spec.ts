/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { TrebolTestModule } from '../../../test.module';
import { ProductCommerceDeleteDialogComponent } from 'app/entities/product-commerce/product-commerce-delete-dialog.component';
import { ProductCommerceService } from 'app/entities/product-commerce/product-commerce.service';

describe('Component Tests', () => {
    describe('ProductCommerce Management Delete Component', () => {
        let comp: ProductCommerceDeleteDialogComponent;
        let fixture: ComponentFixture<ProductCommerceDeleteDialogComponent>;
        let service: ProductCommerceService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductCommerceDeleteDialogComponent]
            })
                .overrideTemplate(ProductCommerceDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductCommerceDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductCommerceService);
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
