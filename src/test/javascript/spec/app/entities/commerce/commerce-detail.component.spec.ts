/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrebolTestModule } from '../../../test.module';
import { CommerceDetailComponent } from 'app/entities/commerce/commerce-detail.component';
import { Commerce } from 'app/shared/model/commerce.model';

describe('Component Tests', () => {
    describe('Commerce Management Detail Component', () => {
        let comp: CommerceDetailComponent;
        let fixture: ComponentFixture<CommerceDetailComponent>;
        const route = ({ data: of({ commerce: new Commerce(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [CommerceDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CommerceDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CommerceDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.commerce).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
