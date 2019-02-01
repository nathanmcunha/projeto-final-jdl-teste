import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Disciplina } from 'app/shared/model/disciplina.model';
import { DisciplinaService } from './disciplina.service';
import { DisciplinaComponent } from './disciplina.component';
import { DisciplinaDetailComponent } from './disciplina-detail.component';
import { DisciplinaUpdateComponent } from './disciplina-update.component';
import { DisciplinaDeletePopupComponent } from './disciplina-delete-dialog.component';
import { IDisciplina } from 'app/shared/model/disciplina.model';

@Injectable({ providedIn: 'root' })
export class DisciplinaResolve implements Resolve<IDisciplina> {
    constructor(private service: DisciplinaService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDisciplina> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Disciplina>) => response.ok),
                map((disciplina: HttpResponse<Disciplina>) => disciplina.body)
            );
        }
        return of(new Disciplina());
    }
}

export const disciplinaRoute: Routes = [
    {
        path: '',
        component: DisciplinaComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.disciplina.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: DisciplinaDetailComponent,
        resolve: {
            disciplina: DisciplinaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.disciplina.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: DisciplinaUpdateComponent,
        resolve: {
            disciplina: DisciplinaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.disciplina.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: DisciplinaUpdateComponent,
        resolve: {
            disciplina: DisciplinaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.disciplina.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const disciplinaPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: DisciplinaDeletePopupComponent,
        resolve: {
            disciplina: DisciplinaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'projetofinaljdltesteApp.disciplina.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
