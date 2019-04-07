/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { CommerceUserDetailComponent } from 'app/entities/commerce-user/commerce-user-detail.component';
import { CommerceUser } from 'app/shared/model/commerce-user.model';

describe('Component Tests', () => {
    describe('CommerceUser Management Detail Component', () => {
        let comp: CommerceUserDetailComponent;
        let fixture: ComponentFixture<CommerceUserDetailComponent>;
        const route = ({ data: of({ commerceUser: new CommerceUser(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [CommerceUserDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CommerceUserDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CommerceUserDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.commerceUser).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
