import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IProfessor } from 'app/shared/model/professor.model';
import { AccountService } from 'app/core';
import { ProfessorService } from './professor.service';

@Component({
    selector: 'jhi-professor',
    templateUrl: './professor.component.html'
})
export class ProfessorComponent implements OnInit, OnDestroy {
    professors: IProfessor[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected professorService: ProfessorService,
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
            this.professorService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IProfessor[]>) => res.ok),
                    map((res: HttpResponse<IProfessor[]>) => res.body)
                )
                .subscribe((res: IProfessor[]) => (this.professors = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.professorService
            .query()
            .pipe(
                filter((res: HttpResponse<IProfessor[]>) => res.ok),
                map((res: HttpResponse<IProfessor[]>) => res.body)
            )
            .subscribe(
                (res: IProfessor[]) => {
                    this.professors = res;
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
        this.registerChangeInProfessors();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IProfessor) {
        return item.id;
    }

    registerChangeInProfessors() {
        this.eventSubscriber = this.eventManager.subscribe('professorListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
