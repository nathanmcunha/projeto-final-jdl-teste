import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPredio } from 'app/shared/model/predio.model';

@Component({
    selector: 'jhi-predio-detail',
    templateUrl: './predio-detail.component.html'
})
export class PredioDetailComponent implements OnInit {
    predio: IPredio;

    constructor(protected activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ predio }) => {
            this.predio = predio;
        });
    }

    previousState() {
        window.history.back();
    }
}
