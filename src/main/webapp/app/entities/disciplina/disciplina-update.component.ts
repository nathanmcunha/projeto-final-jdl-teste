import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDisciplina } from 'app/shared/model/disciplina.model';
import { DisciplinaService } from './disciplina.service';
import { ISala } from 'app/shared/model/sala.model';
import { SalaService } from 'app/entities/sala';
import { ICurso } from 'app/shared/model/curso.model';
import { CursoService } from 'app/entities/curso';

@Component({
    selector: 'jhi-disciplina-update',
    templateUrl: './disciplina-update.component.html'
})
export class DisciplinaUpdateComponent implements OnInit {
    disciplina: IDisciplina;
    isSaving: boolean;

    salas: ISala[];

    cursos: ICurso[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected disciplinaService: DisciplinaService,
        protected salaService: SalaService,
        protected cursoService: CursoService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ disciplina }) => {
            this.disciplina = disciplina;
        });
        this.salaService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<ISala[]>) => mayBeOk.ok),
                map((response: HttpResponse<ISala[]>) => response.body)
            )
            .subscribe((res: ISala[]) => (this.salas = res), (res: HttpErrorResponse) => this.onError(res.message));
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
        if (this.disciplina.id !== undefined) {
            this.subscribeToSaveResponse(this.disciplinaService.update(this.disciplina));
        } else {
            this.subscribeToSaveResponse(this.disciplinaService.create(this.disciplina));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IDisciplina>>) {
        result.subscribe((res: HttpResponse<IDisciplina>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackSalaById(index: number, item: ISala) {
        return item.id;
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
