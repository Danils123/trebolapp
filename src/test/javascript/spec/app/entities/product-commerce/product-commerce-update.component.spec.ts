/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ProductCommerceUpdateComponent } from 'app/entities/product-commerce/product-commerce-update.component';
import { ProductCommerceService } from 'app/entities/product-commerce/product-commerce.service';
import { ProductCommerce } from 'app/shared/model/product-commerce.model';

describe('Component Tests', () => {
    describe('ProductCommerce Management Update Component', () => {
        let comp: ProductCommerceUpdateComponent;
        let fixture: ComponentFixture<ProductCommerceUpdateComponent>;
        let service: ProductCommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductCommerceUpdateComponent]
            })
                .overrideTemplate(ProductCommerceUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProductCommerceUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductCommerceService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductCommerce(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productCommerce = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductCommerce();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productCommerce = entity;
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
