/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { ProductCommerceComponent } from 'app/entities/product-commerce/product-commerce.component';
import { ProductCommerceService } from 'app/entities/product-commerce/product-commerce.service';
import { ProductCommerce } from 'app/shared/model/product-commerce.model';

describe('Component Tests', () => {
    describe('ProductCommerce Management Component', () => {
        let comp: ProductCommerceComponent;
        let fixture: ComponentFixture<ProductCommerceComponent>;
        let service: ProductCommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductCommerceComponent],
                providers: []
            })
                .overrideTemplate(ProductCommerceComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProductCommerceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductCommerceService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ProductCommerce(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.productCommerces[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
