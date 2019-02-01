/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ProjetofinaljdltesteTestModule } from '../../../test.module';
import { CursoUpdateComponent } from 'app/entities/curso/curso-update.component';
import { CursoService } from 'app/entities/curso/curso.service';
import { Curso } from 'app/shared/model/curso.model';

describe('Component Tests', () => {
    describe('Curso Management Update Component', () => {
        let comp: CursoUpdateComponent;
        let fixture: ComponentFixture<CursoUpdateComponent>;
        let service: CursoService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ProjetofinaljdltesteTestModule],
                declarations: [CursoUpdateComponent]
            })
                .overrideTemplate(CursoUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CursoUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CursoService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Curso(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.curso = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Curso();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.curso = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
