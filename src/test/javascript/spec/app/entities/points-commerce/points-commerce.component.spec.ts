/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { PointsCommerceComponent } from 'app/entities/points-commerce/points-commerce.component';
import { PointsCommerceService } from 'app/entities/points-commerce/points-commerce.service';
import { PointsCommerce } from 'app/shared/model/points-commerce.model';

describe('Component Tests', () => {
    describe('PointsCommerce Management Component', () => {
        let comp: PointsCommerceComponent;
        let fixture: ComponentFixture<PointsCommerceComponent>;
        let service: PointsCommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [PointsCommerceComponent],
                providers: []
            })
                .overrideTemplate(PointsCommerceComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PointsCommerceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PointsCommerceService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new PointsCommerce(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.pointsCommerces[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
