/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { RankingPerOrderDetailComponent } from 'app/entities/ranking-per-order/ranking-per-order-detail.component';
import { RankingPerOrder } from 'app/shared/model/ranking-per-order.model';

describe('Component Tests', () => {
    describe('RankingPerOrder Management Detail Component', () => {
        let comp: RankingPerOrderDetailComponent;
        let fixture: ComponentFixture<RankingPerOrderDetailComponent>;
        const route = ({ data: of({ rankingPerOrder: new RankingPerOrder(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [RankingPerOrderDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(RankingPerOrderDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(RankingPerOrderDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.rankingPerOrder).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
