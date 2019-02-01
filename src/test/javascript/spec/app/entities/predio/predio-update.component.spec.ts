/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ProjetofinaljdltesteTestModule } from '../../../test.module';
import { PredioUpdateComponent } from 'app/entities/predio/predio-update.component';
import { PredioService } from 'app/entities/predio/predio.service';
import { Predio } from 'app/shared/model/predio.model';

describe('Component Tests', () => {
    describe('Predio Management Update Component', () => {
        let comp: PredioUpdateComponent;
        let fixture: ComponentFixture<PredioUpdateComponent>;
        let service: PredioService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ProjetofinaljdltesteTestModule],
                declarations: [PredioUpdateComponent]
            })
                .overrideTemplate(PredioUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PredioUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PredioService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Predio(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.predio = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Predio();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.predio = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
