/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { ScheduleCommerceComponent } from 'app/entities/schedule-commerce/schedule-commerce.component';
import { ScheduleCommerceService } from 'app/entities/schedule-commerce/schedule-commerce.service';
import { ScheduleCommerce } from 'app/shared/model/schedule-commerce.model';

describe('Component Tests', () => {
    describe('ScheduleCommerce Management Component', () => {
        let comp: ScheduleCommerceComponent;
        let fixture: ComponentFixture<ScheduleCommerceComponent>;
        let service: ScheduleCommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ScheduleCommerceComponent],
                providers: []
            })
                .overrideTemplate(ScheduleCommerceComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ScheduleCommerceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ScheduleCommerceService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ScheduleCommerce(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.scheduleCommerces[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
