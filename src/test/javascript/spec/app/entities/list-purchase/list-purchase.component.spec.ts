/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { ListPurchaseComponent } from 'app/entities/list-purchase/list-purchase.component';
import { ListPurchaseService } from 'app/entities/list-purchase/list-purchase.service';
import { ListPurchase } from 'app/shared/model/list-purchase.model';

describe('Component Tests', () => {
    describe('ListPurchase Management Component', () => {
        let comp: ListPurchaseComponent;
        let fixture: ComponentFixture<ListPurchaseComponent>;
        let service: ListPurchaseService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [ListPurchaseComponent],
                providers: []
            })
                .overrideTemplate(ListPurchaseComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ListPurchaseComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ListPurchaseService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new ListPurchase(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.listPurchases[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
