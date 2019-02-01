import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ISala } from 'app/shared/model/sala.model';
import { AccountService } from 'app/core';
import { SalaService } from './sala.service';

@Component({
    selector: 'jhi-sala',
    templateUrl: './sala.component.html'
})
export class SalaComponent implements OnInit, OnDestroy {
    salas: ISala[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected salaService: SalaService,
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
            this.salaService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<ISala[]>) => res.ok),
                    map((res: HttpResponse<ISala[]>) => res.body)
                )
                .subscribe((res: ISala[]) => (this.salas = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.salaService
            .query()
            .pipe(
                filter((res: HttpResponse<ISala[]>) => res.ok),
                map((res: HttpResponse<ISala[]>) => res.body)
            )
            .subscribe(
                (res: ISala[]) => {
                    this.salas = res;
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
        this.registerChangeInSalas();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ISala) {
        return item.id;
    }

    registerChangeInSalas() {
        this.eventSubscriber = this.eventManager.subscribe('salaListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
