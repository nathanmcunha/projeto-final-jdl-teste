import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICurso } from 'app/shared/model/curso.model';
import { CursoService } from './curso.service';
import { IDisciplina } from 'app/shared/model/disciplina.model';
import { DisciplinaService } from 'app/entities/disciplina';
import { IProfessor } from 'app/shared/model/professor.model';
import { ProfessorService } from 'app/entities/professor';

@Component({
    selector: 'jhi-curso-update',
    templateUrl: './curso-update.component.html'
})
export class CursoUpdateComponent implements OnInit {
    curso: ICurso;
    isSaving: boolean;

    disciplinas: IDisciplina[];

    professors: IProfessor[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected cursoService: CursoService,
        protected disciplinaService: DisciplinaService,
        protected professorService: ProfessorService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ curso }) => {
            this.curso = curso;
        });
        this.disciplinaService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IDisciplina[]>) => mayBeOk.ok),
                map((response: HttpResponse<IDisciplina[]>) => response.body)
            )
            .subscribe((res: IDisciplina[]) => (this.disciplinas = res), (res: HttpErrorResponse) => this.onError(res.message));
        this.professorService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IProfessor[]>) => mayBeOk.ok),
                map((response: HttpResponse<IProfessor[]>) => response.body)
            )
            .subscribe((res: IProfessor[]) => (this.professors = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.curso.id !== undefined) {
            this.subscribeToSaveResponse(this.cursoService.update(this.curso));
        } else {
            this.subscribeToSaveResponse(this.cursoService.create(this.curso));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ICurso>>) {
        result.subscribe((res: HttpResponse<ICurso>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackDisciplinaById(index: number, item: IDisciplina) {
        return item.id;
    }

    trackProfessorById(index: number, item: IProfessor) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
