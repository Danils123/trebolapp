/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { PointsCommerceDetailComponent } from 'app/entities/points-commerce/points-commerce-detail.component';
import { PointsCommerce } from 'app/shared/model/points-commerce.model';

describe('Component Tests', () => {
    describe('PointsCommerce Management Detail Component', () => {
        let comp: PointsCommerceDetailComponent;
        let fixture: ComponentFixture<PointsCommerceDetailComponent>;
        const route = ({ data: of({ pointsCommerce: new PointsCommerce(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [PointsCommerceDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PointsCommerceDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PointsCommerceDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.pointsCommerce).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
