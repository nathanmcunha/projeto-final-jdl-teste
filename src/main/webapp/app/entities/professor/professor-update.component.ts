import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IProfessor } from 'app/shared/model/professor.model';
import { ProfessorService } from './professor.service';
import { ICurso } from 'app/shared/model/curso.model';
import { CursoService } from 'app/entities/curso';

@Component({
    selector: 'jhi-professor-update',
    templateUrl: './professor-update.component.html'
})
export class ProfessorUpdateComponent implements OnInit {
    professor: IProfessor;
    isSaving: boolean;

    cursos: ICurso[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected professorService: ProfessorService,
        protected cursoService: CursoService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ professor }) => {
            this.professor = professor;
        });
        this.cursoService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ICurso[]>) => mayBeOk.ok),
                map((response: HttpResponse<ICurso[]>) => response.body)
            )
            .subscribe((res: ICurso[]) => (this.cursos = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.professor.id !== undefined) {
            this.subscribeToSaveResponse(this.professorService.update(this.professor));
        } else {
            this.subscribeToSaveResponse(this.professorService.create(this.professor));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfessor>>) {
        result.subscribe((res: HttpResponse<IProfessor>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCursoById(index: number, item: ICurso) {
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
