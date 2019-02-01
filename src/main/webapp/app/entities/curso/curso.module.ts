import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ProjetofinaljdltesteSharedModule } from 'app/shared';
import {
    CursoComponent,
    CursoDetailComponent,
    CursoUpdateComponent,
    CursoDeletePopupComponent,
    CursoDeleteDialogComponent,
    cursoRoute,
    cursoPopupRoute
} from './';

const ENTITY_STATES = [...cursoRoute, ...cursoPopupRoute];

@NgModule({
    imports: [ProjetofinaljdltesteSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [CursoComponent, CursoDetailComponent, CursoUpdateComponent, CursoDeleteDialogComponent, CursoDeletePopupComponent],
    entryComponents: [CursoComponent, CursoUpdateComponent, CursoDeleteDialogComponent, CursoDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjetofinaljdltesteCursoModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
