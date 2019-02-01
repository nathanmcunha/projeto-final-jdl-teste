import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISala } from 'app/shared/model/sala.model';
import { SalaService } from './sala.service';

@Component({
    selector: 'jhi-sala-delete-dialog',
    templateUrl: './sala-delete-dialog.component.html'
})
export class SalaDeleteDialogComponent {
    sala: ISala;

    constructor(protected salaService: SalaService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.salaService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'salaListModification',
                content: 'Deleted an sala'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-sala-delete-popup',
    template: ''
})
export class SalaDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ sala }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(SalaDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.sala = sala;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate(['/sala', { outlets: { popup: null } }]);
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate(['/sala', { outlets: { popup: null } }]);
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
