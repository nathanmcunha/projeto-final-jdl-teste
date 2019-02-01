/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { ProjetofinaljdltesteTestModule } from '../../../test.module';
import { PredioComponent } from 'app/entities/predio/predio.component';
import { PredioService } from 'app/entities/predio/predio.service';
import { Predio } from 'app/shared/model/predio.model';

describe('Component Tests', () => {
    describe('Predio Management Component', () => {
        let comp: PredioComponent;
        let fixture: ComponentFixture<PredioComponent>;
        let service: PredioService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ProjetofinaljdltesteTestModule],
                declarations: [PredioComponent],
                providers: []
            })
                .overrideTemplate(PredioComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(PredioComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PredioService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Predio(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.predios[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
