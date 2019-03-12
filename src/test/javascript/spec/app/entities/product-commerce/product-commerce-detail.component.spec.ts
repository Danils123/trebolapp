/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ProductCommerceDetailComponent } from 'app/entities/product-commerce/product-commerce-detail.component';
import { ProductCommerce } from 'app/shared/model/product-commerce.model';

describe('Component Tests', () => {
    describe('ProductCommerce Management Detail Component', () => {
        let comp: ProductCommerceDetailComponent;
        let fixture: ComponentFixture<ProductCommerceDetailComponent>;
        const route = ({ data: of({ productCommerce: new ProductCommerce(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductCommerceDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProductCommerceDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductCommerceDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.productCommerce).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
