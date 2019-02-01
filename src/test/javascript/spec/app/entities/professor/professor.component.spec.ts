/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ProjetofinaljdltesteTestModule } from '../../../test.module';
import { ProfessorComponent } from 'app/entities/professor/professor.component';
import { ProfessorService } from 'app/entities/professor/professor.service';
import { Professor } from 'app/shared/model/professor.model';

describe('Component Tests', () => {
    describe('Professor Management Component', () => {
        let comp: ProfessorComponent;
        let fixture: ComponentFixture<ProfessorComponent>;
        let service: ProfessorService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ProjetofinaljdltesteTestModule],
                declarations: [ProfessorComponent],
                providers: []
            })
                .overrideTemplate(ProfessorComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ProfessorComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ProfessorService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Professor(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.professors[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
