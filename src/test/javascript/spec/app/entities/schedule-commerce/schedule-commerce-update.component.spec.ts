/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ScheduleCommerceUpdateComponent } from 'app/entities/schedule-commerce/schedule-commerce-update.component';
import { ScheduleCommerceService } from 'app/entities/schedule-commerce/schedule-commerce.service';
import { ScheduleCommerce } from 'app/shared/model/schedule-commerce.model';

describe('Component Tests', () => {
    describe('ScheduleCommerce Management Update Component', () => {
        let comp: ScheduleCommerceUpdateComponent;
        let fixture: ComponentFixture<ScheduleCommerceUpdateComponent>;
        let service: ScheduleCommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ScheduleCommerceUpdateComponent]
            })
                .overrideTemplate(ScheduleCommerceUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ScheduleCommerceUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ScheduleCommerceService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ScheduleCommerce(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.scheduleCommerce = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ScheduleCommerce();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.scheduleCommerce = entity;
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
