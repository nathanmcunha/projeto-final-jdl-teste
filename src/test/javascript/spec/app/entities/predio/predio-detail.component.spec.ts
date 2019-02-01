/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProjetofinaljdltesteTestModule } from '../../../test.module';
import { PredioDetailComponent } from 'app/entities/predio/predio-detail.component';
import { Predio } from 'app/shared/model/predio.model';

describe('Component Tests', () => {
    describe('Predio Management Detail Component', () => {
        let comp: PredioDetailComponent;
        let fixture: ComponentFixture<PredioDetailComponent>;
        const route = ({ data: of({ predio: new Predio(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ProjetofinaljdltesteTestModule],
                declarations: [PredioDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(PredioDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(PredioDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.predio).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
