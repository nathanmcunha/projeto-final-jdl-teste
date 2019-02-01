import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ProjetofinaljdltesteSharedModule } from 'app/shared';
import {
    SalaComponent,
    SalaDetailComponent,
    SalaUpdateComponent,
    SalaDeletePopupComponent,
    SalaDeleteDialogComponent,
    salaRoute,
    salaPopupRoute
} from './';

const ENTITY_STATES = [...salaRoute, ...salaPopupRoute];

@NgModule({
    imports: [ProjetofinaljdltesteSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [SalaComponent, SalaDetailComponent, SalaUpdateComponent, SalaDeleteDialogComponent, SalaDeletePopupComponent],
    entryComponents: [SalaComponent, SalaUpdateComponent, SalaDeleteDialogComponent, SalaDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjetofinaljdltesteSalaModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
