/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ListScheduleUpdateComponent } from 'app/entities/list-schedule/list-schedule-update.component';
import { ListScheduleService } from 'app/entities/list-schedule/list-schedule.service';
import { ListSchedule } from 'app/shared/model/list-schedule.model';

describe('Component Tests', () => {
    describe('ListSchedule Management Update Component', () => {
        let comp: ListScheduleUpdateComponent;
        let fixture: ComponentFixture<ListScheduleUpdateComponent>;
        let service: ListScheduleService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ListScheduleUpdateComponent]
            })
                .overrideTemplate(ListScheduleUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ListScheduleUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ListScheduleService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ListSchedule(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.listSchedule = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ListSchedule();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.listSchedule = entity;
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
