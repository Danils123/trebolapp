/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { RankingPerOrderUpdateComponent } from 'app/entities/ranking-per-order/ranking-per-order-update.component';
import { RankingPerOrderService } from 'app/entities/ranking-per-order/ranking-per-order.service';
import { RankingPerOrder } from 'app/shared/model/ranking-per-order.model';

describe('Component Tests', () => {
    describe('RankingPerOrder Management Update Component', () => {
        let comp: RankingPerOrderUpdateComponent;
        let fixture: ComponentFixture<RankingPerOrderUpdateComponent>;
        let service: RankingPerOrderService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [RankingPerOrderUpdateComponent]
            })
                .overrideTemplate(RankingPerOrderUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(RankingPerOrderUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(RankingPerOrderService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new RankingPerOrder(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.rankingPerOrder = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new RankingPerOrder();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.rankingPerOrder = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
