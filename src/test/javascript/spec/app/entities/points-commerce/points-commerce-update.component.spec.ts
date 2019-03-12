/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { PointsCommerceUpdateComponent } from 'app/entities/points-commerce/points-commerce-update.component';
import { PointsCommerceService } from 'app/entities/points-commerce/points-commerce.service';
import { PointsCommerce } from 'app/shared/model/points-commerce.model';

describe('Component Tests', () => {
    describe('PointsCommerce Management Update Component', () => {
        let comp: PointsCommerceUpdateComponent;
        let fixture: ComponentFixture<PointsCommerceUpdateComponent>;
        let service: PointsCommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [PointsCommerceUpdateComponent]
            })
                .overrideTemplate(PointsCommerceUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PointsCommerceUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PointsCommerceService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new PointsCommerce(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.pointsCommerce = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new PointsCommerce();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.pointsCommerce = entity;
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
