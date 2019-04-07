/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { CommerceUserUpdateComponent } from 'app/entities/commerce-user/commerce-user-update.component';
import { CommerceUserService } from 'app/entities/commerce-user/commerce-user.service';
import { CommerceUser } from 'app/shared/model/commerce-user.model';

describe('Component Tests', () => {
    describe('CommerceUser Management Update Component', () => {
        let comp: CommerceUserUpdateComponent;
        let fixture: ComponentFixture<CommerceUserUpdateComponent>;
        let service: CommerceUserService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [CommerceUserUpdateComponent]
            })
                .overrideTemplate(CommerceUserUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CommerceUserUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CommerceUserService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new CommerceUser(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.commerceUser = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new CommerceUser();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.commerceUser = entity;
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
