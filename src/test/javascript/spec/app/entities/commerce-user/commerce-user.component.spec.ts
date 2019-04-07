/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { CommerceUserComponent } from 'app/entities/commerce-user/commerce-user.component';
import { CommerceUserService } from 'app/entities/commerce-user/commerce-user.service';
import { CommerceUser } from 'app/shared/model/commerce-user.model';

describe('Component Tests', () => {
    describe('CommerceUser Management Component', () => {
        let comp: CommerceUserComponent;
        let fixture: ComponentFixture<CommerceUserComponent>;
        let service: CommerceUserService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [CommerceUserComponent],
                providers: []
            })
                .overrideTemplate(CommerceUserComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CommerceUserComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CommerceUserService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new CommerceUser(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.commerceUsers[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
