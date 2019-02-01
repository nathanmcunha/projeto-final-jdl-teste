import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IPredio } from 'app/shared/model/predio.model';
import { AccountService } from 'app/core';
import { PredioService } from './predio.service';

@Component({
    selector: 'jhi-predio',
    templateUrl: './predio.component.html'
})
export class PredioComponent implements OnInit, OnDestroy {
    predios: IPredio[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        protected predioService: PredioService,
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
            this.predioService
                .search({
                    query: this.currentSearch
                })
                .pipe(
                    filter((res: HttpResponse<IPredio[]>) => res.ok),
                    map((res: HttpResponse<IPredio[]>) => res.body)
                )
                .subscribe((res: IPredio[]) => (this.predios = res), (res: HttpErrorResponse) => this.onError(res.message));
            return;
        }
        this.predioService
            .query()
            .pipe(
                filter((res: HttpResponse<IPredio[]>) => res.ok),
                map((res: HttpResponse<IPredio[]>) => res.body)
            )
            .subscribe(
                (res: IPredio[]) => {
                    this.predios = res;
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
        this.registerChangeInPredios();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IPredio) {
        return item.id;
    }

    registerChangeInPredios() {
        this.eventSubscriber = this.eventManager.subscribe('predioListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
