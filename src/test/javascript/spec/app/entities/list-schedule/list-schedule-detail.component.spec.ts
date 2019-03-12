/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ListScheduleDetailComponent } from 'app/entities/list-schedule/list-schedule-detail.component';
import { ListSchedule } from 'app/shared/model/list-schedule.model';

describe('Component Tests', () => {
    describe('ListSchedule Management Detail Component', () => {
        let comp: ListScheduleDetailComponent;
        let fixture: ComponentFixture<ListScheduleDetailComponent>;
        const route = ({ data: of({ listSchedule: new ListSchedule(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ListScheduleDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ListScheduleDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ListScheduleDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.listSchedule).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
