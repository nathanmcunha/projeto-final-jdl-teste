/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ProjetofinaljdltesteTestModule } from '../../../test.module';
import { DisciplinaComponent } from 'app/entities/disciplina/disciplina.component';
import { DisciplinaService } from 'app/entities/disciplina/disciplina.service';
import { Disciplina } from 'app/shared/model/disciplina.model';

describe('Component Tests', () => {
    describe('Disciplina Management Component', () => {
        let comp: DisciplinaComponent;
        let fixture: ComponentFixture<DisciplinaComponent>;
        let service: DisciplinaService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ProjetofinaljdltesteTestModule],
                declarations: [DisciplinaComponent],
                providers: []
            })
                .overrideTemplate(DisciplinaComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(DisciplinaComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(DisciplinaService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Disciplina(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.disciplinas[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
