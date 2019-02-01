/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ProjetofinaljdltesteTestModule } from '../../../test.module';
import { PredioDeleteDialogComponent } from 'app/entities/predio/predio-delete-dialog.component';
import { PredioService } from 'app/entities/predio/predio.service';

describe('Component Tests', () => {
    describe('Predio Management Delete Component', () => {
        let comp: PredioDeleteDialogComponent;
        let fixture: ComponentFixture<PredioDeleteDialogComponent>;
        let service: PredioService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ProjetofinaljdltesteTestModule],
                declarations: [PredioDeleteDialogComponent]
            })
                .overrideTemplate(PredioDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PredioDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PredioService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
