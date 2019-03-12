/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { ParametersCommerceComponent } from 'app/entities/parameters-commerce/parameters-commerce.component';
import { ParametersCommerceService } from 'app/entities/parameters-commerce/parameters-commerce.service';
import { ParametersCommerce } from 'app/shared/model/parameters-commerce.model';

describe('Component Tests', () => {
    describe('ParametersCommerce Management Component', () => {
        let comp: ParametersCommerceComponent;
        let fixture: ComponentFixture<ParametersCommerceComponent>;
        let service: ParametersCommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ParametersCommerceComponent],
                providers: []
            })
                .overrideTemplate(ParametersCommerceComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ParametersCommerceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ParametersCommerceService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ParametersCommerce(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.parametersCommerces[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
