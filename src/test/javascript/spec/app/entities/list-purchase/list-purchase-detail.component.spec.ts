/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ListPurchaseDetailComponent } from 'app/entities/list-purchase/list-purchase-detail.component';
import { ListPurchase } from 'app/shared/model/list-purchase.model';

describe('Component Tests', () => {
    describe('ListPurchase Management Detail Component', () => {
        let comp: ListPurchaseDetailComponent;
        let fixture: ComponentFixture<ListPurchaseDetailComponent>;
        const route = ({ data: of({ listPurchase: new ListPurchase(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ListPurchaseDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ListPurchaseDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ListPurchaseDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.listPurchase).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
