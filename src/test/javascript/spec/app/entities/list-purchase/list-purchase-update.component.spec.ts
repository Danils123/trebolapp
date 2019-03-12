/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { ListPurchaseUpdateComponent } from 'app/entities/list-purchase/list-purchase-update.component';
import { ListPurchaseService } from 'app/entities/list-purchase/list-purchase.service';
import { ListPurchase } from 'app/shared/model/list-purchase.model';

describe('Component Tests', () => {
    describe('ListPurchase Management Update Component', () => {
        let comp: ListPurchaseUpdateComponent;
        let fixture: ComponentFixture<ListPurchaseUpdateComponent>;
        let service: ListPurchaseService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ListPurchaseUpdateComponent]
            })
                .overrideTemplate(ListPurchaseUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ListPurchaseUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ListPurchaseService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new ListPurchase(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.listPurchase = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new ListPurchase();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.listPurchase = entity;
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
