/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { ListScheduleComponent } from 'app/entities/list-schedule/list-schedule.component';
import { ListScheduleService } from 'app/entities/list-schedule/list-schedule.service';
import { ListSchedule } from 'app/shared/model/list-schedule.model';

describe('Component Tests', () => {
    describe('ListSchedule Management Component', () => {
        let comp: ListScheduleComponent;
        let fixture: ComponentFixture<ListScheduleComponent>;
        let service: ListScheduleService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ListScheduleComponent],
                providers: []
            })
                .overrideTemplate(ListScheduleComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ListScheduleComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ListScheduleService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ListSchedule(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.listSchedules[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
