import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPredio } from 'app/shared/model/predio.model';
import { PredioService } from './predio.service';

@Component({
    selector: 'jhi-predio-delete-dialog',
    templateUrl: './predio-delete-dialog.component.html'
})
export class PredioDeleteDialogComponent {
    predio: IPredio;

    constructor(protected predioService: PredioService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.predioService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'predioListModification',
                content: 'Deleted an predio'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-predio-delete-popup',
    template: ''
})
export class PredioDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ predio }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(PredioDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.predio = predio;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/predio', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/predio', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
