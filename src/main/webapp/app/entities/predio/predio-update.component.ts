import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IPredio } from 'app/shared/model/predio.model';
import { PredioService } from './predio.service';

@Component({
    selector: 'jhi-predio-update',
    templateUrl: './predio-update.component.html'
})
export class PredioUpdateComponent implements OnInit {
    predio: IPredio;
    isSaving: boolean;

    constructor(protected predioService: PredioService, protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ predio }) => {
            this.predio = predio;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.predio.id !== undefined) {
            this.subscribeToSaveResponse(this.predioService.update(this.predio));
        } else {
            this.subscribeToSaveResponse(this.predioService.create(this.predio));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<IPredio>>) {
        result.subscribe((res: HttpResponse<IPredio>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    protected onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    protected onSaveError() {
        this.isSaving = false;
    }
}
