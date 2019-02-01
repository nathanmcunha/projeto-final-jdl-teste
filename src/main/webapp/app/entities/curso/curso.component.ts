import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICurso } from 'app/shared/model/curso.model';
import { AccountService } from 'app/core';
import { CursoService } from './curso.service';

@Component({
    selector: 'jhi-curso',
    templateUrl: './curso.component.html'
})
export class CursoComponent implements OnInit, OnDestroy {
    cursos: ICurso[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected cursoService: CursoService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {
        this.currentSearch =
            this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search']
                ? this.activatedRoute.snapshot.params['search']
                : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.cursoService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<ICurso[]>) => res.ok),
                    map((res: HttpResponse<ICurso[]>) => res.body)
                )
                .subscribe((res: ICurso[]) => (this.cursos = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.cursoService
            .query()
            .pipe(
                filter((res: HttpResponse<ICurso[]>) => res.ok),
                map((res: HttpResponse<ICurso[]>) => res.body)
            )
            .subscribe(
                (res: ICurso[]) => {
                    this.cursos = res;
                    this.currentSearch = '';
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCursos();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICurso) {
        return item.id;
    }

    registerChangeInCursos() {
        this.eventSubscriber = this.eventManager.subscribe('cursoListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
