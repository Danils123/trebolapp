/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { CommerceUpdateComponent } from 'app/entities/commerce/commerce-update.component';
import { CommerceService } from 'app/entities/commerce/commerce.service';
import { Commerce } from 'app/shared/model/commerce.model';

describe('Component Tests', () => {
    describe('Commerce Management Update Component', () => {
        let comp: CommerceUpdateComponent;
        let fixture: ComponentFixture<CommerceUpdateComponent>;
        let service: CommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [CommerceUpdateComponent]
            })
                .overrideTemplate(CommerceUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CommerceUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CommerceService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Commerce(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.commerce = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Commerce();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.commerce = entity;
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
