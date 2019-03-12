/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { ProductsPerOrderComponent } from 'app/entities/products-per-order/products-per-order.component';
import { ProductsPerOrderService } from 'app/entities/products-per-order/products-per-order.service';
import { ProductsPerOrder } from 'app/shared/model/products-per-order.model';

describe('Component Tests', () => {
    describe('ProductsPerOrder Management Component', () => {
        let comp: ProductsPerOrderComponent;
        let fixture: ComponentFixture<ProductsPerOrderComponent>;
        let service: ProductsPerOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductsPerOrderComponent],
                providers: []
            })
                .overrideTemplate(ProductsPerOrderComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProductsPerOrderComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProductsPerOrderService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ProductsPerOrder(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.productsPerOrders[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
