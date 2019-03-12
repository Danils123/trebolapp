/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ScheduleCommerceDetailComponent } from 'app/entities/schedule-commerce/schedule-commerce-detail.component';
import { ScheduleCommerce } from 'app/shared/model/schedule-commerce.model';

describe('Component Tests', () => {
    describe('ScheduleCommerce Management Detail Component', () => {
        let comp: ScheduleCommerceDetailComponent;
        let fixture: ComponentFixture<ScheduleCommerceDetailComponent>;
        const route = ({ data: of({ scheduleCommerce: new ScheduleCommerce(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ScheduleCommerceDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ScheduleCommerceDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ScheduleCommerceDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.scheduleCommerce).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
