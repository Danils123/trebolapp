/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ProductListUpdateComponent } from 'app/entities/product-list/product-list-update.component';
import { ProductListService } from 'app/entities/product-list/product-list.service';
import { ProductList } from 'app/shared/model/product-list.model';

describe('Component Tests', () => {
    describe('ProductList Management Update Component', () => {
        let comp: ProductListUpdateComponent;
        let fixture: ComponentFixture<ProductListUpdateComponent>;
        let service: ProductListService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductListUpdateComponent]
            })
                .overrideTemplate(ProductListUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProductListUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductListService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductList(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productList = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ProductList();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.productList = entity;
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
