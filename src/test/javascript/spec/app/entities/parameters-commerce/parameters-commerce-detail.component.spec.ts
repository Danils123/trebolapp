/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ParametersCommerceDetailComponent } from 'app/entities/parameters-commerce/parameters-commerce-detail.component';
import { ParametersCommerce } from 'app/shared/model/parameters-commerce.model';

describe('Component Tests', () => {
    describe('ParametersCommerce Management Detail Component', () => {
        let comp: ParametersCommerceDetailComponent;
        let fixture: ComponentFixture<ParametersCommerceDetailComponent>;
        const route = ({ data: of({ parametersCommerce: new ParametersCommerce(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ParametersCommerceDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ParametersCommerceDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ParametersCommerceDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.parametersCommerce).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
