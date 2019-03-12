/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ParametersCommerceUpdateComponent } from 'app/entities/parameters-commerce/parameters-commerce-update.component';
import { ParametersCommerceService } from 'app/entities/parameters-commerce/parameters-commerce.service';
import { ParametersCommerce } from 'app/shared/model/parameters-commerce.model';

describe('Component Tests', () => {
    describe('ParametersCommerce Management Update Component', () => {
        let comp: ParametersCommerceUpdateComponent;
        let fixture: ComponentFixture<ParametersCommerceUpdateComponent>;
        let service: ParametersCommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ParametersCommerceUpdateComponent]
            })
                .overrideTemplate(ParametersCommerceUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ParametersCommerceUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ParametersCommerceService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ParametersCommerce(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.parametersCommerce = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ParametersCommerce();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.parametersCommerce = entity;
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
