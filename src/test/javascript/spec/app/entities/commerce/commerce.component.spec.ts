/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { CommerceComponent } from 'app/entities/commerce/commerce.component';
import { CommerceService } from 'app/entities/commerce/commerce.service';
import { Commerce } from 'app/shared/model/commerce.model';

describe('Component Tests', () => {
    describe('Commerce Management Component', () => {
        let comp: CommerceComponent;
        let fixture: ComponentFixture<CommerceComponent>;
        let service: CommerceService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [CommerceComponent],
                providers: []
            })
                .overrideTemplate(CommerceComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CommerceComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CommerceService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Commerce(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.commerce[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
