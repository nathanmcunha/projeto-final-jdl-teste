import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ProjetofinaljdltesteSharedModule } from 'app/shared';
import {
    DisciplinaComponent,
    DisciplinaDetailComponent,
    DisciplinaUpdateComponent,
    DisciplinaDeletePopupComponent,
    DisciplinaDeleteDialogComponent,
    disciplinaRoute,
    disciplinaPopupRoute
} from './';

const ENTITY_STATES = [...disciplinaRoute, ...disciplinaPopupRoute];

@NgModule({
    imports: [ProjetofinaljdltesteSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        DisciplinaComponent,
        DisciplinaDetailComponent,
        DisciplinaUpdateComponent,
        DisciplinaDeleteDialogComponent,
        DisciplinaDeletePopupComponent
    ],
    entryComponents: [DisciplinaComponent, DisciplinaUpdateComponent, DisciplinaDeleteDialogComponent, DisciplinaDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjetofinaljdltesteDisciplinaModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
