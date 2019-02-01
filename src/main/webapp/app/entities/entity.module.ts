import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'professor',
                loadChildren: './professor/professor.module#ProjetofinaljdltesteProfessorModule'
            },
            {
                path: 'curso',
                loadChildren: './curso/curso.module#ProjetofinaljdltesteCursoModule'
            },
            {
                path: 'disciplina',
                loadChildren: './disciplina/disciplina.module#ProjetofinaljdltesteDisciplinaModule'
            },
            {
                path: 'sala',
                loadChildren: './sala/sala.module#ProjetofinaljdltesteSalaModule'
            },
            {
                path: 'predio',
                loadChildren: './predio/predio.module#ProjetofinaljdltestePredioModule'
            }
            /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
        ])
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjetofinaljdltesteEntityModule {}
