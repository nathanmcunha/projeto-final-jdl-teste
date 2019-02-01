import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ISala } from 'app/shared/model/sala.model';
import { SalaService } from './sala.service';
import { IPredio } from 'app/shared/model/predio.model';
import { PredioService } from 'app/entities/predio';

@Component({
    selector: 'jhi-sala-update',
    templateUrl: './sala-update.component.html'
})
export class SalaUpdateComponent implements OnInit {
    sala: ISala;
    isSaving: boolean;

    predios: IPredio[];

    constructor(
        protected jhiAlertService: JhiAlertService,
        protected salaService: SalaService,
        protected predioService: PredioService,
        protected activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ sala }) => {
            this.sala = sala;
        });
        this.predioService
            .query()
            .pipe(
                filter((mayBeOk: HttpResponse<IPredio[]>) => mayBeOk.ok),
                map((response: HttpResponse<IPredio[]>) => response.body)
            )
            .subscribe((res: IPredio[]) => (this.predios = res), (res: HttpErrorResponse) => this.onError(res.message));
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.sala.id !== undefined) {
            this.subscribeToSaveResponse(this.salaService.update(this.sala));
        } else {
            this.subscribeToSaveResponse(this.salaService.create(this.sala));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<ISala>>) {
        result.subscribe((res: HttpResponse<ISala>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackPredioById(index: number, item: IPredio) {
        return item.id;
    }
}
