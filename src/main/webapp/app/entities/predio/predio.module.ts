import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { ProjetofinaljdltesteSharedModule } from 'app/shared';
import {
    PredioComponent,
    PredioDetailComponent,
    PredioUpdateComponent,
    PredioDeletePopupComponent,
    PredioDeleteDialogComponent,
    predioRoute,
    predioPopupRoute
} from './';

const ENTITY_STATES = [...predioRoute, ...predioPopupRoute];

@NgModule({
    imports: [ProjetofinaljdltesteSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [PredioComponent, PredioDetailComponent, PredioUpdateComponent, PredioDeleteDialogComponent, PredioDeletePopupComponent],
    entryComponents: [PredioComponent, PredioUpdateComponent, PredioDeleteDialogComponent, PredioDeletePopupComponent],
    providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjetofinaljdltestePredioModule {
    constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {
            if (languageKey !== undefined) {
                this.languageService.changeLanguage(languageKey);
            }
        });
    }
}
