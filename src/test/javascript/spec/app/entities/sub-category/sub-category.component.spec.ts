/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { TrebolTestModule } from '../../../test.module';
import { SubCategoryComponent } from 'app/entities/sub-category/sub-category.component';
import { SubCategoryService } from 'app/entities/sub-category/sub-category.service';
import { SubCategory } from 'app/shared/model/sub-category.model';

describe('Component Tests', () => {
    describe('SubCategory Management Component', () => {
        let comp: SubCategoryComponent;
        let fixture: ComponentFixture<SubCategoryComponent>;
        let service: SubCategoryService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TrebolTestModule],
                declarations: [SubCategoryComponent],
                providers: []
            })
                .overrideTemplate(SubCategoryComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SubCategoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SubCategoryService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new SubCategory(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.subCategories[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
