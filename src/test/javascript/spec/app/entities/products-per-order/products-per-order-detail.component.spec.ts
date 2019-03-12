/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ProductsPerOrderDetailComponent } from 'app/entities/products-per-order/products-per-order-detail.component';
import { ProductsPerOrder } from 'app/shared/model/products-per-order.model';

describe('Component Tests', () => {
    describe('ProductsPerOrder Management Detail Component', () => {
        let comp: ProductsPerOrderDetailComponent;
        let fixture: ComponentFixture<ProductsPerOrderDetailComponent>;
        const route = ({ data: of({ productsPerOrder: new ProductsPerOrder(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductsPerOrderDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProductsPerOrderDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductsPerOrderDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.productsPerOrder).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
