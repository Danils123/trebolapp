/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ProductsPerOrderUpdateComponent } from 'app/entities/products-per-order/products-per-order-update.component';
import { ProductsPerOrderService } from 'app/entities/products-per-order/products-per-order.service';
import { ProductsPerOrder } from 'app/shared/model/products-per-order.model';

describe('Component Tests', () => {
    describe('ProductsPerOrder Management Update Component', () => {
        let comp: ProductsPerOrderUpdateComponent;
        let fixture: ComponentFixture<ProductsPerOrderUpdateComponent>;
        let service: ProductsPerOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductsPerOrderUpdateComponent]
            })
                .overrideTemplate(ProductsPerOrderUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProductsPerOrderUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductsPerOrderService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductsPerOrder(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productsPerOrder = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductsPerOrder();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productsPerOrder = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
