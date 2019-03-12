/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { RankingPerOrderComponent } from 'app/entities/ranking-per-order/ranking-per-order.component';
import { RankingPerOrderService } from 'app/entities/ranking-per-order/ranking-per-order.service';
import { RankingPerOrder } from 'app/shared/model/ranking-per-order.model';

describe('Component Tests', () => {
    describe('RankingPerOrder Management Component', () => {
        let comp: RankingPerOrderComponent;
        let fixture: ComponentFixture<RankingPerOrderComponent>;
        let service: RankingPerOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [RankingPerOrderComponent],
                providers: []
            })
                .overrideTemplate(RankingPerOrderComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(RankingPerOrderComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RankingPerOrderService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new RankingPerOrder(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.rankingPerOrders[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
