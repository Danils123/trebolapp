/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ProductListDetailComponent } from 'app/entities/product-list/product-list-detail.component';
import { ProductList } from 'app/shared/model/product-list.model';

describe('Component Tests', () => {
    describe('ProductList Management Detail Component', () => {
        let comp: ProductListDetailComponent;
        let fixture: ComponentFixture<ProductListDetailComponent>;
        const route = ({ data: of({ productList: new ProductList(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ProductListDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ProductListDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ProductListDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.productList).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
